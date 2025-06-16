import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // để module này được dùng ở mọi nơi mà không cần phải import lại
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
