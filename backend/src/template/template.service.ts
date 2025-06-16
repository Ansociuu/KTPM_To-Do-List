import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTemplateDto, userId: number) {
    return this.prisma.template.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  findAllPublic() {
    return this.prisma.template.findMany({
      where: { isPublic: true },
    });
  }

  findUserTemplates(userId: number) {
    return this.prisma.template.findMany({
      where: { userId },
    });
  }

  update(id: number, data: UpdateTemplateDto, userId: number) {
    return this.prisma.template.updateMany({
      where: { id, userId },
      data,
    });
  }

  delete(id: number, userId: number) {
    return this.prisma.template.deleteMany({
      where: { id, userId },
    });
  }
}
