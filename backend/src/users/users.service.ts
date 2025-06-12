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
      },
    });
  }

  async findAll(coproprieteId: string) {
    return this.prisma.user.findMany({
      where: { coproprieteId },
    });
  }

  async findOne(id: number, coproprieteId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, coproprieteId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    coproprieteId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id, coproprieteId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, coproprieteId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, coproprieteId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
