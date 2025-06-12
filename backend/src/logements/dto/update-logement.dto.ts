import { IsString, IsNumber, IsEmail, Min, IsOptional } from 'class-validator';

export class UpdateLogementDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tantieme?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  advanceCharges?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterMeterOld?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterMeterNew?: number;
}
