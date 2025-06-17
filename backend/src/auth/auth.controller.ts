import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto, LoginDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express'; 

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() body: RegisterDto): Promise<User> {
        return this.authService.register(body)
    }

    @Post('login')
    login(@Body() body: LoginDto): Promise<any> {
        return this.authService.login(body)
    }

    @Post('logout')     //Viết logout để frontend gọi 
    logout(@Req() req: Request, @Res() res: Response) {
        // Không lưu JWT bằng cookie thì chỉ cần trả về thông báo
        return res.status(200).json({ message: 'Logged out successfully' })
    }
}