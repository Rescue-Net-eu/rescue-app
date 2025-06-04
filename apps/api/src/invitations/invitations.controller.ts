import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Post()
  async create(@Body() dto: CreateInvitationDto) {
    return this.invitations.create(dto);
  }

  @Get('validate')
  async validate(@Query('token') token: string) {
    return this.invitations.validate(token);
  }
}
