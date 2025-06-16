import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  countdownStart?: string;

  @IsOptional()
  @IsDateString()
  countdownEnd?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  templateId?: number;

  @IsOptional()
  teamId?: number;

  @IsOptional()
  parentId?: number; 

}
