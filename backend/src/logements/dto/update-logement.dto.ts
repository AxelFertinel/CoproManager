import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLogementDto {
  @IsString()
  @IsOptional()
  name?: string;

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

  @IsNumber()
  @IsOptional()
  userId?: number;
}
