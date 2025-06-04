import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() body: { platform: string; token: string }, @Req() req: any) {
    const userId = req.user.userId;
    await this.pushService.registerToken(userId, body.platform, body.token);
    return { success: true };
  }
}
