import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

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

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
