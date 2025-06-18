import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RewardService {

  constructor(private prisma: PrismaService) {}

  async getMyRewards(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
      },
    });
    if (!user) throw new HttpException({message: 'User not found'}, HttpStatus.UNAUTHORIZED)
    return user;
  }

  async getRewardLog(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        rewards: {
          orderBy: { createdAt: 'desc' },
          select: {
             id: true,
             points: true,
             reason: true,
             createdAt: true,
          },
        },
      },
    });
    if (!user) throw new HttpException({message: 'User not found'}, HttpStatus.UNAUTHORIZED)
    return user;
  }
 
}
