import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.membership.findMany();
  }

  create(dto: CreateMembershipDto) {
    return this.prisma.membership.create({ data: dto });
  }

  update(id: number, dto: UpdateMembershipDto) {
    return this.prisma.membership.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.membership.delete({ where: { id } });
  }
}
