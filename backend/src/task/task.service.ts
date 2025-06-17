import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Status } from 'src/common/enums/status.enum';


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
      where: { userId, parentId: null },
      include: {
      subTasks: true,       // lấy luôn subtasks của task này
      },
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

  async getTaskById(id: number) {
  return this.prisma.task.findUnique({
    where: { id },
    include: {      //Dùng include khi muốn bao gồm các mối quan hệ (tức lấy thêm các đối tượng liên quan)
      subTasks: true,       // nếu muốn lấy luôn subtasks của task này
      parent: true,         // nếu muốn biết task này có cha không
      template: true,       // nếu muốn biết task này thuộc template nào
    },
  });
}

  async markTaskAsCompleted(id: number) {
    return this.prisma.task.update({
      where: { id },
      data: {
        status: 'Completed',
        updatedAt: new Date(), // không bắt buộc, nhưng tốt cho tracking
      },
    });
  }

  async updateTaskStatus(id: number, status: Status) {
    return this.prisma.task.update({
      where: { id },
      data: { 
        status, 
        updatedAt: new Date(), 
      },
    });
  }

  async getPersonalTasks(userId: number) {
  return this.prisma.task.findMany({
    where: {
      userId,
      dueDate: { not: null },
    },
    select: {       //Dùng select để chỉ định các trường cụ thể của một bảng
      title: true,
      priority: true,
      status: true,
    },
  });
}

  async getTeamTasks(teamId: number) {
    return this.prisma.task.findMany({
      where: {
        teamId,
        dueDate: { not: null },
      },
      select: {
        title: true,
        priority: true,
        status: true,
        assignee: {
          select: { name: true }, // nếu muốn hiển thị người giao nhiệm vụ
        },
      },
    });
  }

}