import {IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator'
import { Language } from 'src/common/enums/language.enum';

export class RegisterDto {
    @IsEmail()
    email: string          
    
    @MinLength(6)
    password: string
    
    @IsNotEmpty()
    name: string
    

    @IsOptional()
    @IsEnum(Language)
    language?: Language
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string
}