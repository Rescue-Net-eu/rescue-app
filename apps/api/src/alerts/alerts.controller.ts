import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertStatusDto } from './dto/update-alert-status.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private service: AlertsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() dto: UpdateAlertStatusDto) {
    return this.service.updateStatus(+id, dto);
  }
}
