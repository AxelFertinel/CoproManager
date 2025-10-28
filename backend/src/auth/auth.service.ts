import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Une erreur est survenue');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const coproprieteId = await this.prisma.copropriete
      .create({ data: { name: randomUUID() } })
      .then((c) => c.id);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        coproprieteId: coproprieteId,
      },
    });

    const payload = {
      id: user.id,
      role: user.role,
      coproprieteId: coproprieteId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        coproprieteId: user.coproprieteId,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = {
      role: user.role,
      coproprieteId: user.coproprieteId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        coproprieteId: user.coproprieteId,
        role: user.role,
      },
    };
  }

  async logout(userId: number) {
    return { message: 'Déconnexion réussie' };
  }

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        coproprieteId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  }
}
