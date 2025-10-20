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
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewCalculateChargesDto } from 'src/calculations/dto/calculate-charges.dto';

@Controller('charges')
@UseGuards(JwtAuthGuard)
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post()
  create(@Body() createChargeDto: CreateChargeDto, @Request() req) {
    return this.chargesService.create(createChargeDto, req.user.coproprieteId);
  }

  @Get()
  findAll() {
    return this.chargesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargesService.findOne(+id);
  }
  
  @Get('charges')
  fidnAllCharges(@Body() dto: NewCalculateChargesDto, @Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.chargesService.findChargesBetweenDates(
      coproprieteId,
      dto.startDate,
      dto.endDate,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChargeDto: UpdateChargeDto) {
    return this.chargesService.update(+id, updateChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chargesService.remove(+id);
  }
}
