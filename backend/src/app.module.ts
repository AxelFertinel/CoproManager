import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChargesModule } from './charges/charges.module';
import { CalculationsModule } from './calculations/calculations.module';
import { AuthModule } from './auth/auth.module';
import { LogementsModule } from './logements/logements.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ChargesModule,
    CalculationsModule,
    AuthModule,
    LogementsModule,
  ],
  //controllers: [AppController],
  //providers: [AppService],
})

export class AppModule {}
