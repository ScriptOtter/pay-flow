import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/infrastructure/mongo/account.schema';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { IsEitherEmailOrLogin } from 'src/shared/validators/isEitherEmailOrLogin.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, IsEitherEmailOrLogin],
})
export class AuthModule {}
