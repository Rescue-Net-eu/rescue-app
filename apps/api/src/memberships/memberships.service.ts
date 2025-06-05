import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.membership.findMany({
      include: { user: true, organization: true },
    });
  }

  async create(dto: CreateMembershipDto) {
    return this.prisma.membership.create({
      data: {
        userId: dto.userId,
        ...(dto.orgId ? { orgId: dto.orgId } : {}),
        role: dto.role,
        activeByOrg: dto.activeByOrg ?? false,
        activeByUser: dto.activeByUser ?? true,
        status: dto.status ?? 'PENDING',
      },
    });
  }

  async update(id: string, dto: UpdateMembershipDto) {
    const existing = await this.prisma.membership.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Membership not found');
    }
    return this.prisma.membership.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    return this.prisma.membership.delete({ where: { id } });
  }
}
