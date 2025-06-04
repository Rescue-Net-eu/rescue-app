import { Body, Controller, Post } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(private service: InvitationsService) {}

  @Post()
  create(@Body() dto: CreateInvitationDto) {
    return this.service.create(dto);
  }
}
