import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginAccountDto, RegisterAccountDto } from './dto/account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/infrastructure/mongo/account.schema';
import * as argon from 'argon2';
import { TokenService } from './token/token.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}
  public async register(
    accountData: RegisterAccountDto,
    res: Response,
  ): Promise<boolean> {
    if (!accountData) {
      throw new BadRequestException('Не удалось создать пользователя');
    }
    try {
      const { email, login, password, repeat_password } = accountData;
      const existingAccount = await this.accountModel.findOne({
        $or: [{ email }, { login }],
      });
      if (existingAccount) {
        throw new BadRequestException(
          'Аккаунт с таким email или логином уже существует',
        );
      }
      if (password !== repeat_password) {
        throw new BadRequestException('Пароли не совпадают');
      }
      const hashedPassword = await argon.hash(password);
      const createdAccount = new this.accountModel({
        ...accountData,
        password: hashedPassword,
      });
      await createdAccount.save();
      const tokens = await this.tokenService.generate({
        id: createdAccount.id.toString(),
        email: createdAccount.email,
        username: createdAccount.username,
      });
      if (!tokens)
        throw new BadRequestException(
          'Не удалось создать аккаунт, попробуйте снова',
        );
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  public async login(accountData: LoginAccountDto, res: Response) {
    try {
      const { login, email, password } = accountData;
      const existingAccount = await this.accountModel.findOne({
        $or: [{ email }, { login }],
      });
      if (!existingAccount) {
        throw new BadRequestException('Аккаунт не найден');
      }
      const isPasswordValid = await argon.verify(
        existingAccount.password,
        password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Неверный пароль');
      }
      const tokens = await this.tokenService.generate({
        id: existingAccount.id.toString(),
        email: existingAccount.email,
        username: existingAccount.username,
      });
      if (!tokens)
        throw new BadRequestException(
          'Не удалось войти в аккаунт, попробуйте снова',
        );
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  public async refreshToken(token: string, res: Response) {
    try {
      const payload = await this.tokenService.verify(
        token,
        this.configService.getOrThrow('REFRESH_SECRET'),
      );
      if (!payload)
        throw new BadRequestException(
          'Ваши токены недействительны, авторизируйтесь заново',
        );
      const tokens = await this.tokenService.generate({
        id: payload.id,
        email: payload.email,
        username: payload.username,
      });
      if (!tokens)
        throw new BadRequestException(
          'Не удалось обновить токен, попробуйте снова',
        );
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}
