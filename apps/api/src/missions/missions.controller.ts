import { Body, Controller, Get, Post } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Controller('missions')
export class MissionsController {
  constructor(private service: MissionsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateMissionDto) {
    return this.service.create(dto);
  }
}
