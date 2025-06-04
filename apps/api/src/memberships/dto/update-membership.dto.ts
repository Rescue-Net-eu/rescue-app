import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Role, Status } from '@prisma/client';

export class UpdateMembershipDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

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
