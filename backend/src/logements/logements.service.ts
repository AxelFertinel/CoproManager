import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

@Injectable()
export class LogementsService {
  constructor(private prisma: PrismaService) {}

  async create(createLogementDto: CreateLogementDto) {
    return this.prisma.logement.create({
      data: createLogementDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            coproprieteId: true,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.logement.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            coproprieteId: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const logement = await this.prisma.logement.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            coproprieteId: true,
          },
        },
      },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return logement;
  }

  async update(
    id: number,
    userId: number,
    updateLogementDto: UpdateLogementDto,
  ) {
    const logement = await this.prisma.logement.findFirst({
      where: { id, userId },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return this.prisma.logement.update({
      where: { id },
      data: updateLogementDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            coproprieteId: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const logement = await this.prisma.logement.findFirst({
      where: { id, userId },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return this.prisma.logement.delete({
      where: { id },
    });
  }
}
