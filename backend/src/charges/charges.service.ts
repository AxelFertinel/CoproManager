import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) {}

  create(createChargeDto: CreateChargeDto, coproprieteId: string) {
    return this.prisma.charge.create({
      data: {
        ...createChargeDto,
        coproprieteId,
      },
    });
  }

  findAll(coproprieteId: string) {
    return this.prisma.charge.findMany({
      where: {
        coproprieteId,
      },
      select: {
        id: true,
        type: true,
        amount: true,
        date: true,
        startDate: true,
        endDate: true,
        description: true,
        waterUnitPrice: true,
        coproprieteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number, coproprieteId: string) {
    return this.prisma.charge.findUnique({
      where: { id, coproprieteId },
      select: {
        id: true,
        type: true,
        amount: true,
        date: true,
        startDate: true,
        endDate: true,
        description: true,
        waterUnitPrice: true,
        coproprieteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  update(id: number, updateChargeDto: UpdateChargeDto, coproprieteId: string) {
    const { date, startDate, endDate, ...rest } = updateChargeDto;
    return this.prisma.charge.update({
      where: { id, coproprieteId },
      data: {
        ...rest,
        date: date ? new Date(date) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });
  }

  remove(id: number, coproprieteId: string) {
    return this.prisma.charge.delete({
      where: { id, coproprieteId },
    });
  }

  async findChargesBetweenDates(
    coproprieteId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const charges = await this.prisma.charge.findMany({
      where: {
        coproprieteId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return charges;
  }
}
