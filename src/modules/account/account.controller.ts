import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Authorized, Protected } from 'src/shared/decorators';
import { Account } from 'src/infrastructure/mongo/account.schema';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Protected()
  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Мои данные' })
  @ApiResponse({
    status: 200,
    description: 'Получуть мои данные.',
  })
  @ApiResponse({
    status: 401,
    description: 'Не удалось получить мои данные.',
  })
  @ApiBearerAuth()
  public async getMe(@Authorized() account: Account) {
    return await this.accountService.getMe(account);
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
