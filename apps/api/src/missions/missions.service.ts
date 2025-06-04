import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mission.findMany();
  }

  async create(dto: CreateMissionDto, userId: string) {
    return this.prisma.mission.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdateMissionDto) {
    const existing = await this.prisma.mission.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Mission not found');
    return this.prisma.mission.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    return this.prisma.mission.delete({ where: { id } });
  }

  async assign(missionId: string, userId: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission not found');
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.userMission.create({
      data: {
        missionId,
        userId,
      },
    });
  }
}
