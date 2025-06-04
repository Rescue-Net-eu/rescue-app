import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupVolunteerDto } from './dto/signup-volunteer.dto';
import { SignupDirectDto } from './dto/signup-direct.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/volunteer')
  signupVolunteer(@Body() dto: SignupVolunteerDto) {
    return this.authService.signupVolunteer(dto);
  }

  @Post('signup/direct')
  signupDirect(@Body() dto: SignupDirectDto) {
    return this.authService.signupDirect(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
