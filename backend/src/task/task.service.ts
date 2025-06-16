import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async startPomodoro(taskId: number) {
  const now = new Date();
  const end = new Date(now.getTime() + 25 * 60 * 1000); // 25 phút

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        countdownStart: now,
        countdownEnd: end,
      },
      select: {
        id: true,
        title: true,
        countdownStart: true,
        countdownEnd: true,
      },
    });
  }

  async createSubTask(parentId: number, createTaskDto: CreateTaskDto, userId: number) {   //Tạo task con cho task cha
  const parentTask = await this.prisma.task.findUnique({
    where: { id: parentId },
  });

    if (!parentTask) {
      throw new HttpException({message: 'ParentTask not found'}, HttpStatus.UNAUTHORIZED)
    }

    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        parentId: parentId,
        userId: userId,
      },
    });
  }

  async getSubTasks(parentId: number) {
    return this.prisma.task.findMany({
      where: { parentId },
    });
  }

}
