import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        role: 'basic',
        coproprieteId: createUserDto.coproprieteId, // À configurer
      },
    });
  }

  async findAll(coproprieteId: string) {
    return this.prisma.user.findMany({
      where: {
        coproprieteId: coproprieteId,
        role: 'basic', // N'afficher que les utilisateurs de rôle basic
      },
      select: {
        id: true,
        email: true,
        name: true,
        tantieme: true,
        advanceCharges: true,
        waterMeterOld: true,
        waterMeterNew: true,
        role: true,
        coproprieteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, coproprieteId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, coproprieteId },
      select: {
        id: true,
        email: true,
        name: true,
        tantieme: true,
        advanceCharges: true,
        waterMeterOld: true,
        waterMeterNew: true,
        role: true,
        coproprieteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${id} non trouvé dans cette copropriété`,
      );
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    coproprieteId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id, coproprieteId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${id} non trouvé dans cette copropriété`,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string, coproprieteId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, coproprieteId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${id} non trouvé dans cette copropriété`,
      );
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
