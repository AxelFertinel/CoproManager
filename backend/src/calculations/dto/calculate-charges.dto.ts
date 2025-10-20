import {
  isDate,
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CalculateChargesDto {
  @IsNumber()
  @Min(0)
  totalWaterBill: number;

  @IsNumber()
  @Min(0)
  waterUnitPrice: number;

  @IsNumber()
  @Min(0)
  totalInsuranceAmount: number;

  @IsNumber()
  @Min(0)
  totalBankFees: number;

  @IsNumber()
  @Min(1)
  numberOfMonthsForAdvance: number;

  @IsOptional()
  @IsUUID()
  logementId?: number;
}

export class NewCalculateChargesDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
