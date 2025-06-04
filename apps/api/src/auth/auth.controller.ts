import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupVolunteerDto } from './dto/signup-volunteer.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupVolunteerDto) {
    return this.service.signup(dto);
  }
}
