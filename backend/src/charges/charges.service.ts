import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto, ChargeType } from './dto/create-charge.dto';
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

  findAll() {
    return this.prisma.charge.findMany({
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

  findOne(id: number) {
    return this.prisma.charge.findUnique({
      where: { id },
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

  update(id: number, updateChargeDto: UpdateChargeDto) {
    const { coproprieteId, ...data } = updateChargeDto;
    return this.prisma.charge.update({
      where: { id },
      data: {
        ...data,
        ...(coproprieteId && { coproprieteId }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.charge.delete({
      where: { id },
    });
  }
}
