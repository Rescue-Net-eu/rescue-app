import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private service: PasswordResetService) {}

  @Post()
  reset(@Body('email') email: string) {
    return this.service.reset(email);
  }
}
