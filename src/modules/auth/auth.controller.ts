import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAccountDto, RegisterAccountDto } from './dto/account.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Создание аккаунта' })
  @ApiResponse({ status: 201, description: 'Аккаунт успешно создан.' })
  @ApiResponse({ status: 400, description: 'Не удалось создать аккаунт.' })
  @ApiBody({
    description: 'Данные нового пользователя',
    type: RegisterAccountDto,
    examples: {
      example: {
        value: {
          username: 'username',
          email: 'email@example.com',
          login: 'user_login',
          password: 'user_password',
          repeat_password: 'user_password',
        },
      },
    },
  })
  public async register(
    @Body() accountData: RegisterAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(accountData, res);
  }

  @Post('login')
  @HttpCode(201)
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @ApiResponse({ status: 201, description: 'Аккаунт успешно вошёл.' })
  @ApiResponse({ status: 400, description: 'Не удалось войти в аккаунт.' })
  @ApiBody({
    description: 'Данные для входа в аккаунт',
    type: LoginAccountDto,
    examples: {
      example: {
        value: {
          email: 'email@example.com',
          password: 'user_password',
        },
      },
      example2: {
        value: {
          login: 'user_login',
          password: 'user_password',
        },
      },
    },
  })
  public async login(
    @Body() accountData: LoginAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(accountData, res);
  }

  @Post('refresh-token')
  @HttpCode(201)
  @ApiOperation({ summary: 'Обновление токена авторизации' })
  @ApiResponse({ status: 201, description: 'Токен успешно обновлён.' })
  @ApiResponse({ status: 400, description: 'Не удалось обновить токен.' })
  @ApiBody({
    description: 'Данные для входа в аккаунт',
    type: String,
    examples: {
      example: {
        value: {
          refresh_token:
            'eyJhbGciO...CD6L0rLhSkhPZeFISu0XSu19lPbiwHJK3xm9VNN0xmo',
        },
      },
    },
  })
  public async refreshToken(
    @Body() dto: { refresh_token: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token } = dto;
    return await this.authService.refreshToken(refresh_token, res);
  }
}
