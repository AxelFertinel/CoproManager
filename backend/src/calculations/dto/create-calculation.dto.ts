import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCalculationDto {
  @IsUUID()
  logementId: number;

  @IsNumber()
  @Min(0)
  waterAmount: number;

  @IsNumber()
  @Min(0)
  insuranceAmount: number;

  @IsNumber()
  @Min(0)
  bankAmount: number;

  @IsNumber()
  @Min(0)
  advanceCharges: number;

  @IsNumber()
  totalAmount: number;
}
