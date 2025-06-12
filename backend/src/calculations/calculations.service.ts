import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { CalculateChargesDto } from './dto/calculate-charges.dto';

export interface CalculationResult {
  user: {
    id: number;
    name: string;
    tantieme: number;
    advanceCharges: number; // monthly advance charge
    waterMeterOld: number;
    waterMeterNew: number;
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
        ...createCalculationDto,
        date: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.calculation.findMany();
  }

  findOne(id: number) {
    return this.prisma.calculation.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCalculationDto: UpdateCalculationDto) {
    return this.prisma.calculation.update({
      where: { id },
      data: updateCalculationDto,
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
      userId,
    } = dto;

    let users;
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      users = [user];
    } else {
      users = await this.prisma.user.findMany();
    }

    const results: CalculationResult[] = [];

    for (const user of users) {
      // 1. Avance sur charges
      const calculatedAdvance = user.advanceCharges * numberOfMonthsForAdvance;

      // 2. Consommation d'eau
      const waterConsumptionUnits = user.waterMeterNew - user.waterMeterOld;
      const calculatedWaterConsumption = waterConsumptionUnits * waterUnitPrice;

      // 3. Quote-part assurance
      const calculatedInsuranceShare = parseFloat(
        ((totalInsuranceAmount / 100) * user.tantieme).toFixed(2),
      );

      // 4. Quote-part frais bancaires
      const calculatedBankFeesShare = parseFloat(
        ((totalBankFees / 100) * user.tantieme).toFixed(2),
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
        user: {
          id: user.id,
          name: user.name,
          tantieme: user.tantieme,
          advanceCharges: user.advanceCharges,
          waterMeterOld: user.waterMeterOld,
          waterMeterNew: user.waterMeterNew,
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
