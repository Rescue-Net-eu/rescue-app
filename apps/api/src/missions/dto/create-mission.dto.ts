import { IsString, IsOptional } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
