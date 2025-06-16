import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateChargeDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
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
