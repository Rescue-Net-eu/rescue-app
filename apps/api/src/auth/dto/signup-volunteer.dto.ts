import { IsUUID, IsString, IsEmail, IsInt, Min } from 'class-validator';

export class SignupVolunteerDto {
  @IsUUID()
  token: string;

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
}
