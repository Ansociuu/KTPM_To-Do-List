import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('templates')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTemplateDto, @Req() req: Request) {
    return this.service.create(dto, req.user['id']);
  }

  @Get('public')
  findAllPublic() {
    return this.service.findAllPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findUserTemplates(@Req() req: Request) {
    return this.service.findUserTemplates(req.user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
    @Req() req: Request,
  ) {
    return this.service.update(+id, dto, req.user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.service.delete(+id, req.user['id']);
  }
}
