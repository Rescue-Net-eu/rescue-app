import { IsString, IsEmail, IsInt, Min, IsNotEmpty } from 'class-validator';

export class SignupDirectDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(16)
  age: number;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsNotEmpty({ each: true })
  certifications?: string[];

  @IsNotEmpty({ each: true })
  transportModes?: string[];

  @IsNotEmpty({ each: true })
  equipment?: string[];
}
