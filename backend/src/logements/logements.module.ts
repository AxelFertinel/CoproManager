import { Module } from '@nestjs/common';
import { LogementsService } from './logements.service';
import { LogementsController } from './logements.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogementsController],
  providers: [LogementsService],
  exports: [LogementsService],
})
export class LogementsModule {}
