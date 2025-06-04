import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @Get()
  findAll() {
    return this.missionsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @Post()
  create(@Body() dto: CreateMissionDto, @Req() req: any) {
    return this.missionsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMissionDto) {
    return this.missionsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR, Role.VOLUNTEER)
  @Post(':missionId/assign/:userId')
  assign(@Param('missionId') missionId: string, @Param('userId') userId: string) {
    return this.missionsService.assign(missionId, userId);
  }
}
