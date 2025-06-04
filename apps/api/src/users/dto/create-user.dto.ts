import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsInt } from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsEnum(['M','F','OTHER'] as any)
  sex: 'M' | 'F' | 'OTHER';

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserType)
  userType: UserType;
}
