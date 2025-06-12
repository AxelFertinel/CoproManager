import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto, ChargeType } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) {}

  create(createChargeDto: CreateChargeDto) {
    return this.prisma.charge.create({
      data: {
        ...createChargeDto,
        userId:
          createChargeDto.userId === undefined ? null : createChargeDto.userId,
        waterAmount:
          createChargeDto.type === ChargeType.WATER
            ? createChargeDto.amount
            : 0,
        insuranceAmount:
          createChargeDto.type === ChargeType.INSURANCE
            ? createChargeDto.amount
            : 0,
        bankAmount:
          createChargeDto.type === ChargeType.BANK ? createChargeDto.amount : 0,
        advanceCharges: 0,
        totalAmount: createChargeDto.amount,
      },
      include: {
        user: true,
      },
    });
  }

  findAll() {
    return this.prisma.charge.findMany({
      include: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.charge.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  update(id: number, updateChargeDto: UpdateChargeDto) {
    return this.prisma.charge.update({
      where: { id },
      data: updateChargeDto,
      include: {
        user: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.charge.delete({
      where: { id },
    });
  }
}
