import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChargeType } from '../enums/charge-type.enum';

export class CreateChargeDto {
  @IsEnum(ChargeType)
  @IsNotEmpty()
  type: ChargeType;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  logementId?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterUnitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterMeterOld?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterMeterNew?: number;
}
