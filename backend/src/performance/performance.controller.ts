import { Controller, Get, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('personal')
  getPersonalPerformance(@Req() req: Request) {
    const user = req.user as any;
    return this.performanceService.getPersonalStats(user.id);
  }

  @Get('team/:teamId')
  getTeamPerformance(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.performanceService.getTeamStats(teamId);
  }
}

