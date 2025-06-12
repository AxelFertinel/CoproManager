import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

@Injectable()
export class LogementsService {
  constructor(private prisma: PrismaService) {}

  async create(createLogementDto: CreateLogementDto) {
    return this.prisma.logement.create({
      data: {
        name: createLogementDto.name,
        email: createLogementDto.email,
        tantieme: createLogementDto.tantieme,
        advanceCharges: createLogementDto.advanceCharges,
        waterMeterOld: createLogementDto.waterMeterOld,
        waterMeterNew: createLogementDto.waterMeterNew,
      },
    });
  }

  async findAll() {
    return this.prisma.logement.findMany();
  }

  async findOne(id: number) {
    const logement = await this.prisma.logement.findUnique({
      where: { id },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return logement;
  }

  async update(id: number, updateLogementDto: UpdateLogementDto) {
    const logement = await this.prisma.logement.findUnique({
      where: { id },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return this.prisma.logement.update({
      where: { id },
      data: updateLogementDto,
    });
  }

  async remove(id: number) {
    const logement = await this.prisma.logement.findUnique({
      where: { id },
    });

    if (!logement) {
      throw new NotFoundException(`Logement avec l'ID ${id} non trouvé`);
    }

    return this.prisma.logement.delete({
      where: { id },
    });
  }
}
