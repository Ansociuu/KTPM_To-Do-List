import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

    async getPublicTemplates() {
    return this.prisma.template.findMany({
      where: { isPublic: true },
      include: {
        tasks: {
          include: {
            subTasks: true
          }
        }
      }
    });
  }

    async getTemplateDetail(id: number) {
    return this.prisma.template.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            subTasks: true
          }
        }
      }
    });
  }

  async applyTemplate(templateId: number, userId: number) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
      include: { tasks: { include: { subTasks: true } } }
    });

    if (!template) throw new NotFoundException('Template not found');

    // Sao chép mỗi task và subtask
    for (const task of template.tasks) {
      const createdTask = await this.prisma.task.create({
        data: {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          userId,
        }
      });

      for (const sub of task.subTasks) {
        await this.prisma.task.create({
          data: {
            title: sub.title,
            description: sub.description,
            dueDate: sub.dueDate,
            parentId: createdTask.id,
            userId,
          }
        });
      }
    }

    return { message: 'Template applied successfully' };
  }

}
