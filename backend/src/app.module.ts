import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChargesModule } from './charges/charges.module';
import { CalculationsModule } from './calculations/calculations.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, ChargesModule, CalculationsModule],
})
export class AppModule {}
