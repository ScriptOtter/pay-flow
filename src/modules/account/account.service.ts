import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Request } from 'express';
import { Model } from 'mongoose';
import { Account } from 'src/infrastructure/mongo/account.schema';
import { TokenService } from '../auth/token/token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
  public constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  public async getMe(account: Account) {
    try {
      if (!account) {
        return null;
      }

      return account;
    } catch (e) {
      throw new UnauthorizedException('Не удалось получить ваши данные');
    }
  }

  public async findAccountById(
    id: string,
  ): Promise<{ id: string; username: string }> {
    try {
      const account = await this.accountModel.findById({ id });
      if (!account)
        throw new NotFoundException('Не удалось получить данные пользователя');
      return { id: account._id, username: account.username };
    } catch (e) {
      throw new NotFoundException('Не удалось получить данные пользователя');
    }
  }

  public async getAccounts(): Promise<{ id: string; username: string }[]> {
    try {
      const accounts = await this.accountModel.find();
      return accounts.map((account) => ({
        id: account._id,
        username: account.username,
      }));
    } catch (e) {
      throw new NotFoundException('Не удалось получить список пользователей');
    }
  }
}
