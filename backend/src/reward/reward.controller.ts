import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { RewardService } from './reward.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Get()
  getMyRewards(@Req() req: Request) {
    const user = req.user as any;
    return this.rewardService.getMyRewards(user.id);
  }

  @Get('history')
  getRewardLog(@Req() req: Request) {
    const user = req.user as any;
    return this.rewardService.getRewardLog(user.id);
  }

}
