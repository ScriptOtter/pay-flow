import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEitherEmailOrLogin } from 'src/shared/validators/isEitherEmailOrLogin.validator';

export class RegisterAccountDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'email@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Логин пользователя', example: 'user_login' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  login: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'user_password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'user_password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  repeat_password: string;
}

export class LoginAccountDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'email@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Логин пользователя',
    example: 'user_login',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  login?: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'user_password' })
  @IsString()
  @MinLength(8)
  password: string;

  @Validate(IsEitherEmailOrLogin)
  validateEitherField?: any;
}
