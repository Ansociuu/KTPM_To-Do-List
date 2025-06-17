import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfWeek, startOfMonth } from 'date-fns';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  async getPersonalStats(userId: number) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalTasks = await this.prisma.task.count({ where: { userId } });
    const completedTasks = await this.prisma.task.count({ where: { userId, status: 'Completed' } });

    const completedThisWeek = await this.prisma.task.count({
      where: { userId, status: 'Completed', updatedAt: { gte: startOfWeek } },
    });

    const completedThisMonth = await this.prisma.task.count({
      where: { userId, status: 'Completed', updatedAt: { gte: startOfMonth } },
    });

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      completedThisWeek,
      completedThisMonth,
    };
  }

  async getTeamStats(teamId: number) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());                //Thứ hai của tuần
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);              //Ngày đầu 

    //Lấy tất cả nhiệm vụ của 
    const teamTasks = await this.prisma.task.findMany({
      where: { teamId },
      include: { user: true },
    });

    const totalTasks = teamTasks.length;

    //Số nhiệm vụ hoàn thành
    const completedTasks = teamTasks.filter(t => t.status === 'Completed').length;
    const completedThisWeek = teamTasks.filter(t => t.status === 'Completed' && t.updatedAt >= startOfWeek).length;
    const completedThisMonth = teamTasks.filter(t => t.status === 'Completed' && t.updatedAt >= startOfMonth).length;

    //Thống kê cho từng thành viên trong đội
    const memberStatsMap = new Map<number, { name: string, completed: number, total: number }>();

    for (const task of teamTasks) {
      const userId = task.userId;
      const userName = task.user.name;

       // Nếu chưa có người dùng trong bản đồ thì thêm mới
      if (!memberStatsMap.has(userId)) {
        memberStatsMap.set(userId, { name: userName, completed: 0, total: 0 });
      }
      const entry = memberStatsMap.get(userId)!;
      entry.total += 1;

      // Nếu nhiệm vụ đã hoàn thành, tăng số nhiệm vụ hoàn thành cho người dùng
      if (task.status === 'Completed') entry.completed += 1;
    }

    // Chuyển bản đồ thành mảng để trả về
    const memberStats = Array.from(memberStatsMap.entries()).map(([userId, data]) => ({
      userId,
      userName: data.name,
      totalTasks: data.total,
      completedTasks: data.completed,
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    }));

    return {
      teamId,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      completedThisWeek,
      completedThisMonth,
      memberStats,
    };
  }
}
