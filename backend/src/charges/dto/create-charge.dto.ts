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
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterUnitPrice: number;

}
