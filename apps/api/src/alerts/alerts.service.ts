import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertStatusDto } from './dto/update-alert-status.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.alert.findMany();
  }

  create(dto: CreateAlertDto) {
    return this.prisma.alert.create({ data: dto });
  }

  updateStatus(id: number, dto: UpdateAlertStatusDto) {
    return this.prisma.alert.update({ where: { id }, data: dto });
  }
}
