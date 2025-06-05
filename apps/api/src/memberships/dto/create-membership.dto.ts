import { IsUUID, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Role, Status } from '@prisma/client';

export class CreateMembershipDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  orgId?: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsBoolean()
  activeByOrg?: boolean;

  @IsOptional()
  @IsBoolean()
  activeByUser?: boolean;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
