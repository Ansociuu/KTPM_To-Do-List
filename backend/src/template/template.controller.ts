import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('public')
  getPublicTemplates() {
    return this.templateService.getPublicTemplates();
  }

  @Get(':id')
  getTemplateDetail(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.getTemplateDetail(id);
  }

  @Post(':id/use')
  useTemplate(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.templateService.applyTemplate(id, user.id);
  }

}
