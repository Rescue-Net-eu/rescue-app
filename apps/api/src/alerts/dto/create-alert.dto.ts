import { IsString, IsOptional, IsUUID, IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { AlertStatus } from '@prisma/client';

export class CreateAlertDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  sourceOrgId: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  localities: string[];
}
