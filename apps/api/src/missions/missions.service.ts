import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.mission.findMany();
  }

  create(dto: CreateMissionDto) {
    return this.prisma.mission.create({ data: dto });
  }
}
