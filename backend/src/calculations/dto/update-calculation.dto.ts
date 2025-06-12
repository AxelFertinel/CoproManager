import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { CalculateChargesDto } from './calculate-charges.dto';

export class UpdateCalculationDto extends CalculateChargesDto {}
