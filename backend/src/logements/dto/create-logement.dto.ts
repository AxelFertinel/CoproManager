import { IsString, IsNumber, IsEmail, Min, IsUUID } from 'class-validator';

export class CreateLogementDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  tantieme: number;

  @IsNumber()
  @Min(0)
  advanceCharges: number;

  @IsNumber()
  @Min(0)
  waterMeterOld: number;

  @IsNumber()
  @Min(0)
  waterMeterNew: number;

  @IsUUID()
  coproprieteId: string;
}
