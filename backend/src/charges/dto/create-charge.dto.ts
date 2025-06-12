import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsDate,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ChargeType {
  WATER = 'WATER',
  INSURANCE = 'INSURANCE',
  BANK = 'BANK',
}

export class CreateChargeDto {
  @IsEnum(ChargeType)
  @IsNotEmpty()
  type: ChargeType;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @IsUUID()
  @IsOptional()
  logementId?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterUnitPrice?: number;
}
