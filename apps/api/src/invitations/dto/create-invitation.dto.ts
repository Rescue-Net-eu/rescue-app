import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TargetType } from '@prisma/client';

export class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsEnum(TargetType)
  targetType: TargetType;

  @IsOptional()
  @IsUUID()
  targetOrgId?: string;
}
