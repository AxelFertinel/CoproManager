import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  BASIC = 'basic',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  coproprieteId: string;
}
