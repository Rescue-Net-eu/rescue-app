import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PushService } from '../push/push.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertStatusDto } from './dto/update-alert-status.dto';
import { Express } from 'express';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService, private pushService: PushService) {}

  async create(dto: CreateAlertDto, userId: string, files?: Express.Multer.File[]) {
    const org = await this.prisma.organization.findUnique({ where: { id: dto.sourceOrgId } });
    if (!org || !org.isActive) {
      throw new BadRequestException('Source organization not found or not active');
    }
    const alert = await this.prisma.alert.create({
      data: {
        title: dto.title,
        description: dto.description,
        sourceOrgId: dto.sourceOrgId,
        country: dto.country,
        region: dto.region,
        localities: dto.localities,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: 'PENDING_APPROVAL',
        createdBy: userId,
      },
    });

    if (files && files.length > 0) {
      const createImages = files.map((file) =>
        this.prisma.alertImage.create({
          data: {
            alertId: alert.id,
            url: `uploads/alerts/${file.filename}`,
          },
        })
      );
      await Promise.all(createImages);
    }

    await this.pushService.sendAlertNotification(alert);

    return alert;
  }

  async findAll(scope: 'local' | 'region' | 'country' | 'all', user: any) {
    let whereClause: any = {};
    if (scope === 'local') {
      whereClause = { localities: { has: user.city }, status: 'ACTIVE' };
    } else if (scope === 'region') {
      whereClause = { region: user.region, status: 'ACTIVE' };
    } else if (scope === 'country') {
      whereClause = { country: user.country, status: 'ACTIVE' };
    }
    return this.prisma.alert.findMany({ where: whereClause, include: { images: true } });
  }

  async findOne(id: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id }, include: { images: true } });
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  async updateStatus(id: string, dto: UpdateAlertStatusDto) {
    const existing = await this.prisma.alert.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Alert not found');
    return this.prisma.alert.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    return this.prisma.alert.delete({ where: { id } });
  }

  async subscribe(alertId: string, userId: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
    if (!alert || alert.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot subscribe to inactive or non-existent alert');
    }
    return this.prisma.alertSubscription.create({
      data: {
        alertId,
        userId,
      },
    });
  }
}
