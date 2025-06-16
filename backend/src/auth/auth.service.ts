import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dtos/auth.dto';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService) {}

    register = async (userData: RegisterDto): Promise<User> => {
        //step 1: check email xem da ton tai chua
        const user = await this.prismaService.user.findUnique({
            where: {
                email: userData.email
            }
        })  
        if (user) {
            throw new HttpException({message: 'Email nay da duoc su dung'}, HttpStatus.BAD_REQUEST) 
        }
        
        //step 2: hash password and store to db
        const hashPassword = await hash(userData.password, 10)
        
        const res = await this.prismaService.user.create({
            data: { ...userData, password: hashPassword}
        })

        return res
    }

    login = async (data:{email:string, password:string}): Promise<any> => {
        //step 1: check user co ton tai hay khong
        const user = await this.prismaService.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) {
            throw new HttpException({message: 'Tai khoan khong ton tai'}, HttpStatus.UNAUTHORIZED)
        }

        //step 2: check password
        const verify = await compare(data.password, user.password)

        if (!verify) {
            throw new HttpException({message: 'Mat khau khong chinh xac'}, HttpStatus.UNAUTHORIZED)
        }

        //step 3: tao access token va refresh token 
        const payload = {id: user.id, name: user.name, email: user.email}
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_KEY,
            expiresIn: '1h'
        }) 
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_KEY,
            expiresIn: '7d'
        }) 

        return {
            accessToken,
            refreshToken
        }

    }
}