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
import { CalculateChargesDto } from './dto/calculate-charges.dto';


@Controller('charges')
@UseGuards(JwtAuthGuard)
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post()
  create(@Body() createChargeDto: CreateChargeDto, @Request() req) {
    return this.chargesService.create(createChargeDto, req.user.coproprieteId);
  }

  @Get()
  findAll(@Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.chargesService.findAll(coproprieteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.chargesService.findOne(+id, coproprieteId);
  }

  @Get('charges')
  fidnAllCharges(@Body() date: CalculateChargesDto, @Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.chargesService.findChargesBetweenDates(
      coproprieteId,
      date.startDate,
      date.endDate,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChargeDto: UpdateChargeDto,
    @Request() req,
  ) {
    const coproprieteId = req.user.coproprieteId;
    return this.chargesService.update(+id, updateChargeDto, coproprieteId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.chargesService.remove(+id, coproprieteId);
  }
}
