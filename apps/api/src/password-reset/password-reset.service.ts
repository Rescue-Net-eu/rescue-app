import { Injectable } from '@nestjs/common';
import { sendEmail } from '../common/utils/send-email';

@Injectable()
export class PasswordResetService {
  async reset(email: string) {
    await sendEmail(email, 'Reset Password', 'Click here');
    return { ok: true };
  }
}
