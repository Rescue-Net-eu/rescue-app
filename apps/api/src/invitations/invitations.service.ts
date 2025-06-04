import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { addDays, isAfter } from 'date-fns';
import { sendEmail } from '../common/utils/send-email';

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvitationDto) {
    if (dto.targetOrgId) {
      const org = await this.prisma.organization.findUnique({ where: { id: dto.targetOrgId } });
      if (!org || !org.isActive) {
        throw new BadRequestException('Organization does not exist or is not active');
      }
    }
    const expiresAt = addDays(new Date(), 7);
    const tokenRecord = await this.prisma.invitationToken.create({
      data: { ...dto, expiresAt },
    });

    const link = `${process.env.INVITE_BASE_URL}/${tokenRecord.token}`;
    await sendEmail(
      dto.email,
      'Rescue-Net.eu Invitation',
      `<p>You have been invited. Click <a href="${link}">here</a> to complete your signup.</p>`
    );

    return { token: tokenRecord.token, expiresAt: tokenRecord.expiresAt };
  }

  async validate(token: string) {
    const inv = await this.prisma.invitationToken.findUnique({ where: { token } });
    if (!inv) throw new NotFoundException('Token not found');
    if (inv.used || isAfter(new Date(), inv.expiresAt)) {
      return { valid: false };
    }
    return { valid: true, targetType: inv.targetType, targetOrgId: inv.targetOrgId };
  }

  async markUsed(token: string) {
    await this.prisma.invitationToken.update({
      where: { token },
      data: { used: true },
    });
  }
}
