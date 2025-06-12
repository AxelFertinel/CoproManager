import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateCalculationDto {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsNumber()
  @IsOptional()
  waterAmount?: number;

  @IsNumber()
  @IsOptional()
  insuranceAmount?: number;

  @IsNumber()
  @IsOptional()
  bankAmount?: number;

  @IsNumber()
  @IsOptional()
  advanceCharges?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  coproprieteId?: string;
}
