import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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
