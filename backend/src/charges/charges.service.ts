import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) {}

  async create(createChargeDto: CreateChargeDto) {
    return this.prisma.charge.create({
      data: {
        ...createChargeDto,
        userId: createChargeDto.userId || null,
        startDate: createChargeDto.startDate || new Date(),
        endDate: createChargeDto.endDate || new Date(),
      },
    });
  }

  async findAll() {
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
        userId: true,
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
    const charge = await this.prisma.charge.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        amount: true,
        date: true,
        startDate: true,
        endDate: true,
        description: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!charge) {
      throw new NotFoundException(`Charge avec l'ID ${id} non trouvée`);
    }

    return charge;
  }

  async update(id: number, updateChargeDto: UpdateChargeDto) {
    const charge = await this.prisma.charge.findUnique({
      where: { id },
    });

    if (!charge) {
      throw new NotFoundException(`Charge avec l'ID ${id} non trouvée`);
    }

    return this.prisma.charge.update({
      where: { id },
      data: {
        ...updateChargeDto,
        userId: updateChargeDto.userId || null,
      },
    });
  }

  async remove(id: number) {
    const charge = await this.prisma.charge.findUnique({
      where: { id },
    });

    if (!charge) {
      throw new NotFoundException(`Charge avec l'ID ${id} non trouvée`);
    }

    return this.prisma.charge.delete({
      where: { id },
    });
  }
}
