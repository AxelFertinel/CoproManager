import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LogementsService } from './logements.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('logements')
@UseGuards(JwtAuthGuard)
export class LogementsController {
  constructor(private readonly logementsService: LogementsService) {}

  @Post()
  create(@Body() createLogementDto: CreateLogementDto, @Request() req) {
    return this.logementsService.create(
      createLogementDto,
      req.user.coproprieteId,
    );
  }

  @Get()
  findAll(@Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.logementsService.findAll(coproprieteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.logementsService.findOne(+id, coproprieteId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogementDto: UpdateLogementDto,
    @Request() req,
  ) {
    const coproprieteId = req.user.coproprieteId;
    return this.logementsService.update(+id, updateLogementDto, coproprieteId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const coproprieteId = req.user.coproprieteId;
    return this.logementsService.remove(+id, coproprieteId);
  }
}
