import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { CalculateChargesDto } from './dto/calculate-charges.dto';

export interface CalculationResult {
  logement: {
    id: number;
    name: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    user: {
      id: number;
      email: string;
      coproprieteId: string;
    };
  };
  totalWaterBill: number;
  waterUnitPrice: number;
  totalInsuranceAmount: number;
  totalBankFees: number;
  numberOfMonthsForAdvance: number;
  calculatedAdvance: number;
  calculatedWaterConsumption: number;
  calculatedInsuranceShare: number;
  calculatedBankFeesShare: number;
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

  async calculateCharges(
    dto: CalculateChargesDto,
  ): Promise<CalculationResult[]> {
    const {
      totalWaterBill,
      waterUnitPrice,
      totalInsuranceAmount,
      totalBankFees,
      numberOfMonthsForAdvance,
      logementId,
    } = dto;

    let logements;
    if (logementId) {
      const logement = await this.prisma.logement.findUnique({
        where: { id: logementId },
      });
      if (!logement) {
        throw new Error('Logement non trouvé');
      }
      logements = [logement];
    } else {
      logements = await this.prisma.logement.findMany({});
    }

    const results: CalculationResult[] = [];

    for (const logement of logements) {
      // 1. Avance sur charges
      const calculatedAdvance =
        logement.advanceCharges * numberOfMonthsForAdvance;

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

      // 5. Solde final
      const totalCharges = parseFloat(
        (
          calculatedWaterConsumption +
          calculatedInsuranceShare +
          calculatedBankFeesShare
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
          user: {
            id: logement.user.id,
            email: logement.user.email,
            coproprieteId: logement.user.coproprieteId,
          },
        },
        totalWaterBill,
        waterUnitPrice,
        totalInsuranceAmount,
        totalBankFees,
        numberOfMonthsForAdvance,
        calculatedAdvance,
        calculatedWaterConsumption,
        calculatedInsuranceShare,
        calculatedBankFeesShare,
        totalCharges,
        finalBalance: parseFloat(finalBalance.toFixed(2)),
        status,
      });
    }

    return results;
  }
}
