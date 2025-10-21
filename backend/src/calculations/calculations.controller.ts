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
import { CalculationsService } from './calculations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalculateChargesDto } from './dto/calculate-charges.dto';

@Controller('calculations')
@UseGuards(JwtAuthGuard)
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  // @Post()
  // create(@Body() createCalculationDto: CreateCalculationDto) {
  //   return this.calculationsService.create(createCalculationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.calculationsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.calculationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: number,
  //   @Body() updateCalculationDto: UpdateCalculationDto,
  // ) {
  //   return this.calculationsService.update(+id, updateCalculationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.calculationsService.remove(+id);
  // }

  @Post()
  async new(@Body() CalculateChargesDto: CalculateChargesDto, @Request() req) {
    const coproprieteId = req.user.coproprieteId;

    return this.calculationsService.CalculCharges(
      CalculateChargesDto,
      coproprieteId,
    );
  }
}
