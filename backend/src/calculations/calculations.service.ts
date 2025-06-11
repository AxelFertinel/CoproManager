import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  async create(createCalculationDto: CreateCalculationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createCalculationDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createCalculationDto.userId} non trouvé`,
      );
    }

    return this.prisma.calculation.create({
      data: createCalculationDto,
    });
  }

  async findAll() {
    return this.prisma.calculation.findMany({
      select: {
        id: true,
        userId: true,
        waterAmount: true,
        insuranceAmount: true,
        bankAmount: true,
        advanceCharges: true,
        totalAmount: true,
        date: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const calculation = await this.prisma.calculation.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        waterAmount: true,
        insuranceAmount: true,
        bankAmount: true,
        advanceCharges: true,
        totalAmount: true,
        date: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!calculation) {
      throw new NotFoundException(`Calcul avec l'ID ${id} non trouvé`);
    }

    return calculation;
  }

  async update(id: number, updateCalculationDto: UpdateCalculationDto) {
    const calculation = await this.prisma.calculation.findUnique({
      where: { id },
    });

    if (!calculation) {
      throw new NotFoundException(`Calcul avec l'ID ${id} non trouvé`);
    }

    return this.prisma.calculation.update({
      where: { id },
      data: updateCalculationDto,
    });
  }

  async remove(id: number) {
    const calculation = await this.prisma.calculation.findUnique({
      where: { id },
    });

    if (!calculation) {
      throw new NotFoundException(`Calcul avec l'ID ${id} non trouvé`);
    }

    return this.prisma.calculation.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return this.prisma.calculation.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        waterAmount: true,
        insuranceAmount: true,
        bankAmount: true,
        advanceCharges: true,
        totalAmount: true,
        date: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async calculateCharges(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Calcul des charges d'eau
    const waterAmount = (user.waterMeterNew - user.waterMeterOld) * 2.9;

    // Calcul des charges d'assurance (exemple avec une assurance de 1000€)
    const insuranceAmount = (1000 * user.tantieme) / 100;

    // Calcul des frais bancaires (exemple avec des frais de 100€)
    const bankAmount = (100 * user.tantieme) / 100;

    // Calcul des avances sur charges
    const advanceCharges = user.advanceCharges * 3; // Pour 3 mois

    // Calcul du montant total
    const totalAmount =
      waterAmount + insuranceAmount + bankAmount - advanceCharges;

    // Création du calcul
    return this.prisma.calculation.create({
      data: {
        userId,
        waterAmount,
        insuranceAmount,
        bankAmount,
        advanceCharges,
        totalAmount,
        date: new Date(),
      },
    });
  }
}
