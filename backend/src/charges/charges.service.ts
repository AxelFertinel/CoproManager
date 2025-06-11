import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto } from './dto/create-charge.dto';
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
