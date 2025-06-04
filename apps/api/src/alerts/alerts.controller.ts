import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertStatusDto } from './dto/update-alert-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post()
  create(
    @Body() createAlertDto: CreateAlertDto,
    @Req() req: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.alertsService.create(createAlertDto, req.user.userId, files?.images);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query('scope') scope: 'local' | 'region' | 'country' | 'all', @Req() req: any) {
    return this.alertsService.findAll(scope, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateAlertStatusDto: UpdateAlertStatusDto) {
    return this.alertsService.updateStatus(id, updateAlertStatusDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VOLUNTEER)
  @Post(':id/subscribe/:userId')
  subscribe(@Param('id') id: string, @Param('userId') userId: string) {
    return this.alertsService.subscribe(id, userId);
  }
}
