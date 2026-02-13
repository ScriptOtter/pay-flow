import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/infrastructure/mongo/account.schema';

@Injectable()
export class AccountService {
  public constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
  ) {}

  public async findAccountById(
    id: string,
  ): Promise<Pick<Account, 'id' | 'username'> | null> {
    try {
      const account = await this.accountModel.findOne({ id });
      if (!account)
        throw new NotFoundException('Не удалось получить данные пользователя');
      return { id: account.id, username: account.username };
    } catch (e) {
      throw new NotFoundException('Не удалось получить данные пользователя');
    }
  }

  public async getAccounts(): Promise<Pick<Account, 'id' | 'username'>[]> {
    try {
      const accounts = await this.accountModel.find();
      return accounts.map((account) => ({
        id: account.id,
        username: account.username,
      }));
    } catch (e) {
      throw new NotFoundException('Не удалось получить список пользователей');
    }
  }
}
