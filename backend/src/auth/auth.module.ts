import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtService } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy]
})
export class AuthModule {}
