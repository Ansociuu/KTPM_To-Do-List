import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TaskModule } from './task/task.module';
import { PerformanceModule } from './performance/performance.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [AuthModule, UsersModule, TaskModule, PerformanceModule, TemplateModule ],
  controllers: [AppController],  // Đảm bảo controller này đã được thêm vào đây
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe 
    }
  ],
})
export class AppModule {}
