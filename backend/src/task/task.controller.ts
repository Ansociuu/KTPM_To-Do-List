import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    const user = req.user as { id: number };
    return this.taskService.create(user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.taskService.findAll(user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto
  ) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }

  @Patch(':id/pomodoro')
  async startPomodoro(@Param('id') id: string) {
    return this.taskService.startPomodoro(+id);
  }

  @Post(':parentId/subtasks')
  createSubTask(
    @Param('parentId', ParseIntPipe) parentId: number,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.taskService.createSubTask(parentId, createTaskDto, user.id);
  }

  @Get(':parentId/subtasks')
  getSubTasks(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.taskService.getSubTasks(parentId);
  }
  
}
