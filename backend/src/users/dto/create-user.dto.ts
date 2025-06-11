import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
}
