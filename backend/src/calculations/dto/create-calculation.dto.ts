import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateCalculationDto {
  @IsDate()
  date: Date;

  @IsNumber()
  waterAmount: number;

  @IsNumber()
  insuranceAmount: number;

  @IsNumber()
  bankAmount: number;

  @IsNumber()
  advanceCharges: number;

  @IsNumber()
  totalAmount: number;

  @IsString()
  coproprieteId: string;
}
