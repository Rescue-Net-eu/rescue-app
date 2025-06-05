import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.PLATFORM_ADMIN,
    Role.GOV_OPERATOR,
    Role.INST_OPERATOR,
    Role.ORG_OPERATOR,
    Role.ERCC_OPERATOR,
    Role.VOLUNTEER,
  )
  @Get()
  search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}
