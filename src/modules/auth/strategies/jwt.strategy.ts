import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from 'src/infrastructure/mongo/account.schema';
import { TokenPayload } from 'src/shared/interfaces/token.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
    });
  }

  public async validate(payload: TokenPayload) {
    const user = await this.accountModel.findById(payload.id);
    if (!user) {
      throw new Error('Account not found');
    }
    return user;
  }
}
