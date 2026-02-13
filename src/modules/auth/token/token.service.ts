import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, Tokens } from 'src/shared/interfaces/token.interface';

@Injectable()
export class TokenService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generate(payload: TokenPayload): Promise<Tokens | null> {
    try {
      return {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '15m',
          algorithm: 'HS256',
          secret: this.configService.getOrThrow<string>('ACCESS_SECRET'),
        }),
        refresh_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          algorithm: 'HS256',
          secret: this.configService.getOrThrow<string>('REFRESH_SECRET'),
        }),
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async verify(token: string, secret: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
