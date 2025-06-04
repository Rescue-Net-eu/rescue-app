import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { addHours, isAfter } from 'date-fns';
import { sendEmail } from '../common/utils/send-email';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  constructor(private prisma: PrismaService) {}

  async requestReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = uuidv4();
    const expiresAt = addHours(new Date(), 1);
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });
    const link = `${process.env.INVITE_BASE_URL}/password-reset/${token}`;
    await sendEmail(
      email,
      'Password Reset Request',
      `<p>Click <a href="${link}">here</a> to reset your password. The link expires in 1 hour.</p>`
    );
    return { message: 'Password reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.used || isAfter(new Date(), record.expiresAt)) {
      throw new BadRequestException('Token invalid or expired');
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashed },
    });
    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
    return { message: 'Password successfully reset' };
  }
}
