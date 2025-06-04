import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

@Controller()
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('password-reset-request')
  requestReset(@Body('email') email: string) {
    return this.passwordResetService.requestReset(email);
  }

  @Post('password-reset')
  resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.passwordResetService.resetPassword(token, newPassword);
  }
}
