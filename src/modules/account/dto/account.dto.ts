import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
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
}
