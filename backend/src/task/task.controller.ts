import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
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

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTaskById(id);
  }

  @Patch(':id/complete')
  markTaskAsCompleted(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.markTaskAsCompleted(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto
  ) {
      return this.taskService.updateTaskStatus(id, dto.status);
    }

  // Calendar view
  @Get('calendar/personal')
  getPersonalCalendar(@Req() req: Request) {
    const user = req.user as any;
    return this.taskService.getPersonalTasks(user.id);
  }

  @Get('calendar/team/:teamId')
  getTeamCalendar(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: Request,
  ) {
    // Optional: kiểm tra user có thuộc team không nếu muốn bảo vệ
    return this.taskService.getTeamTasks(teamId);
  }

}