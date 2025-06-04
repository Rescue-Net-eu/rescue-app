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
import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.'),
      false,
    );
  }
  cb(null, true);
};

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.GOV_OPERATOR, Role.INST_OPERATOR, Role.ORG_OPERATOR, Role.ERCC_OPERATOR)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      fileFilter,
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
