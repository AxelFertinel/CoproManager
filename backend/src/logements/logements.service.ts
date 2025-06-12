import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

@Injectable()
export class LogementsService {
  constructor(private prisma: PrismaService) {}

  async create(createLogementDto: CreateLogementDto, coproprieteId: string) {
    return this.prisma.logement.create({
      data: {
        ...createLogementDto,
        coproprieteId,
      },
    });
  }

  async findAll(coproprieteId: string) {
    return this.prisma.logement.findMany({
      where: { coproprieteId },
    });
  }

  async findOne(id: number, coproprieteId: string) {
    const logement = await this.prisma.logement.findFirst({
      where: { id, coproprieteId },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return logement;
  }

  async update(
    id: number,
    updateLogementDto: UpdateLogementDto,
    coproprieteId: string,
  ) {
    const logement = await this.prisma.logement.findFirst({
      where: { id, coproprieteId },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return this.prisma.logement.update({
      where: { id },
      data: updateLogementDto,
    });
  }

  async remove(id: number, coproprieteId: string) {
    const logement = await this.prisma.logement.findFirst({
      where: { id, coproprieteId },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return this.prisma.logement.delete({
      where: { id },
    });
  }
}
