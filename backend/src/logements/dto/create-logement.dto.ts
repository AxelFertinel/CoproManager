import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateLogementDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  tantieme: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  advanceCharges: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  waterMeterOld: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  waterMeterNew: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
