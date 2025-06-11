import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCalculationDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalAmount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  waterAmount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  insuranceAmount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  bankAmount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  advanceCharges: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
