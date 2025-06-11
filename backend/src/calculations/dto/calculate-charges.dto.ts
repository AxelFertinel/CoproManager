import { IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateChargesDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  totalWaterBill: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  waterUnitPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  totalInsuranceAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  totalBankFees: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  numberOfMonthsForAdvance: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number; // Optionnel : pour calculer les charges d'un seul utilisateur
}
