import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { NewCalculateChargesDto } from './dto/calculate-charges.dto';
import { resourceLimits } from 'worker_threads';

export interface CalculationResult {
  logement: {
    id: number;
    name: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    email: string;
    coproprieteId: string;
  };
  totalWaterBill: number;
  waterUnitPrice: number;
  totalInsuranceAmount: number;
  totalBankFees: number;
  calculatedAdvance: number;
  calculatedWaterConsumption: number;
  calculatedInsuranceShare: number;
  calculatedBankFeesShare: number;
  totalCharges: number;
  finalBalance: number;
  status: 'to_pay' | 'to_reimburse' | 'balanced';
}

export interface NewCalculationResult {
  logement: {
    id: number;
    name: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    email: string;
    coproprieteId: string;
  };
  totalMonth: number;
  totalWaterBill: number;
  waterUnitPrice?: number;
  totalInsuranceAmount: number;
  totalBankFees: number;
  calculatedAdvance: number;
  calculatedWaterConsumption: number;
  calculatedInsuranceShare: number;
  calculatedBankFeesShare: number;
  calculatedOtherCharges: number;
  totalOtherCharges?: number;
  totalCharges: number;
  finalBalance: number;
  status: 'to_pay' | 'to_reimburse' | 'balanced';
}
@Injectable()
export class CalculationsService {
  constructor(private prisma: PrismaService) {}

  create(createCalculationDto: CreateCalculationDto) {
    return this.prisma.calculation.create({
      data: {
        date: createCalculationDto.date,
        waterAmount: createCalculationDto.waterAmount,
        insuranceAmount: createCalculationDto.insuranceAmount,
        bankAmount: createCalculationDto.bankAmount,
        advanceCharges: createCalculationDto.advanceCharges,
        totalAmount: createCalculationDto.totalAmount,
        coproprieteId: createCalculationDto.coproprieteId,
      },
    });
  }

  findAll() {
    return this.prisma.calculation.findMany({
      select: {
        id: true,
        date: true,
        waterAmount: true,
        insuranceAmount: true,
        bankAmount: true,
        advanceCharges: true,
        totalAmount: true,
        coproprieteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.calculation.findUnique({
      where: { id },
      select: {
        id: true,
        date: true,
        waterAmount: true,
        insuranceAmount: true,
        bankAmount: true,
        advanceCharges: true,
        totalAmount: true,
        coproprieteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  update(id: number, updateCalculationDto: UpdateCalculationDto) {
    return this.prisma.calculation.update({
      where: { id },
      data: {
        date: updateCalculationDto.date,
        waterAmount: updateCalculationDto.waterAmount,
        insuranceAmount: updateCalculationDto.insuranceAmount,
        bankAmount: updateCalculationDto.bankAmount,
        advanceCharges: updateCalculationDto.advanceCharges,
        totalAmount: updateCalculationDto.totalAmount,
        coproprieteId: updateCalculationDto.coproprieteId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.calculation.delete({
      where: { id },
    });
  }

  async newCalculCharges(
    dto: NewCalculateChargesDto,
    userCoproprieteId: string,
  ) {
    const { startDate, endDate } = dto;

    const results: NewCalculationResult[] = [];

    const logements = await this.prisma.logement.findMany({
      where: { coproprieteId: userCoproprieteId },
    });

    const bills = await this.prisma.charge.findMany({
      where: {
        coproprieteId: userCoproprieteId,
        // startDate: { gte: startDate },
        // endDate: { lte: endDate },
        date: { gte: startDate, lte: endDate },
      },
    });

    const month =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1;

    let waterUnitPrice = 0;
    let totalWaterUnitPrice = 0;
    let totalWaterBill = 0;
    let waterBillCount = 0;

    let totalInsuranceAmount = 0;
    let totalOtherCharges = 0;
    let totalBankFees = 0;

    const monthsBetween = (
      startDate: Date | string,
      endDate: Date | string,
    ) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start)
        return 0;
      return (
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) +
        1
      );
    };

    for (const bill of bills) {
      if (bill.type === 'WATER') {
        totalWaterBill += bill.amount;
        totalWaterUnitPrice += bill.waterUnitPrice ?? 0;
        waterBillCount += 1;
      }

      if (bill.type === 'INSURANCE') {
        if (bill.startDate && bill.endDate) {
          const months = monthsBetween(bill.startDate, bill.endDate);
          totalInsuranceAmount += (bill.amount ?? 0) * months;
        }
      }

      if (bill.type === 'BANK') {
        if (bill.startDate && bill.endDate) {
          const months = monthsBetween(bill.startDate, bill.endDate);
          totalBankFees += (bill.amount ?? 0) * months;
        }
      }

      if (bill.type === 'OTHER') {
        totalOtherCharges += bill.amount ?? 0;
      }
    }

    waterUnitPrice =
      waterBillCount > 0 ? totalWaterUnitPrice / waterBillCount : 0;

    for (const logement of logements) {
      // 1. Avance ur charge
      const calculatedAdvance = logement.advanceCharges * month;

      // 2. Consommation d'eau
      const waterConsumptionUnits =
        logement.waterMeterNew - logement.waterMeterOld;
      const calculatedWaterConsumption = waterConsumptionUnits * waterUnitPrice;

      // 3. Quote-part assurance
      const calculatedInsuranceShare = parseFloat(
        ((totalInsuranceAmount / 100) * logement.tantieme).toFixed(2),
      );

      // 4. Quote-part frais bancaires
      const calculatedBankFeesShare = parseFloat(
        ((totalBankFees / 100) * logement.tantieme).toFixed(2),
      );
      // 5. Quote-part autre frais
      const calculatedOtherCharges = parseFloat(
        ((totalOtherCharges / 100) * logement.tantieme).toFixed(2),
      );

      // 6. Solde final
      const totalCharges = parseFloat(
        (
          calculatedWaterConsumption +
          calculatedInsuranceShare +
          calculatedBankFeesShare +
          calculatedOtherCharges
        ).toFixed(2),
      );
      const finalBalance = totalCharges - calculatedAdvance;

      let status: 'to_pay' | 'to_reimburse' | 'balanced' = 'balanced';
      if (finalBalance > 0) {
        status = 'to_pay';
      } else if (finalBalance < 0) {
        status = 'to_reimburse';
      }

      results.push({
        logement: {
          id: logement.id,
          name: logement.name,
          tantieme: logement.tantieme,
          advanceCharges: logement.advanceCharges,
          waterMeterOld: logement.waterMeterOld,
          waterMeterNew: logement.waterMeterNew,
          email: logement.email,
          coproprieteId: logement.coproprieteId,
        },
        totalMonth: month,
        totalWaterBill,
        waterUnitPrice,
        totalInsuranceAmount,
        totalBankFees,
        calculatedAdvance,
        calculatedWaterConsumption,
        calculatedInsuranceShare,
        calculatedBankFeesShare,
        calculatedOtherCharges,
        totalOtherCharges,
        totalCharges,
        finalBalance: parseFloat(finalBalance.toFixed(2)),
        status,
      });
    }

    return results;
  }
}
