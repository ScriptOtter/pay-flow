import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан.' })
  @ApiResponse({ status: 400, description: 'Не удалось создать пользователя.' })
  @ApiBody({
    description: 'Данные нового пользователя',
    type: CreateAccountDto,
    examples: {
      example: {
        value: {
          username: 'username',
          email: 'email@example.com',
          login: 'user_login',
          password: 'user_password',
        },
      },
    },
  })
  public async createAccount(@Body() accountData: CreateAccountDto) {
    return await this.accountService.createAccount(accountData);
  }

  @Get('all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей успешно получен.',
  })
  @ApiResponse({
    status: 404,
    description: 'Не удалось получить список пользователей.',
  })
  public async getAccounts() {
    return await this.accountService.getAccounts();
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение данных пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя успешно получены.',
  })
  @ApiResponse({
    status: 404,
    description: 'Не удалось получить данные пользователя.',
  })
  public async getAccountById(@Query('id') id: string) {
    return await this.accountService.findAccountById(id);
  }
}
