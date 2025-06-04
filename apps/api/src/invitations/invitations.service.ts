import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateInvitationDto) {
    return this.prisma.invitation.create({ data: dto });
  }
}
