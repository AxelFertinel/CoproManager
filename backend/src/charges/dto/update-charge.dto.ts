import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateChargeDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  waterUnitPrice?: number;

  @IsString()
  @IsOptional()
  coproprieteId?: string;
}
