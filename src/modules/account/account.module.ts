import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountSchema } from 'src/infrastructure/mongo/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../auth/strategies';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
})
export class AccountModule {}
