import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CalculationsService, CalculationResult } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { NewCalculateChargesDto } from './dto/calculate-charges.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('calculations')
@UseGuards(JwtAuthGuard)
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  create(@Body() createCalculationDto: CreateCalculationDto) {
    return this.calculationsService.create(createCalculationDto);
  }

  @Get()
  findAll() {
    return this.calculationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.calculationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCalculationDto: UpdateCalculationDto,
  ) {
    return this.calculationsService.update(+id, updateCalculationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calculationsService.remove(+id);
  }

  @Post('test')
  async new(
    @Body() NewCalculateChargesDto: NewCalculateChargesDto,
    @Request() req,
  ) {
    const coproprieteId = req.user.coproprieteId;

    return this.calculationsService.newCalculCharges(
      NewCalculateChargesDto,
      coproprieteId,
    );
  }
}
