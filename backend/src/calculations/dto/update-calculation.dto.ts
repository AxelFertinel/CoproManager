import { PartialType } from '@nestjs/mapped-types';
import { CreateCalculationDto } from './create-calculation.dto';

export class UpdateCalculationDto extends PartialType(CreateCalculationDto) {}
