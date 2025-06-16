import { IsOptional, IsString, IsIn, MinLength, IsEnum } from 'class-validator';
import { Language } from 'src/common/enums/language.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
