import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from 'src/infrastructure/mongo/account.schema';

export const Authorized = createParamDecorator(
  (
    data: keyof Pick<Account, '_id' | 'email' | 'login'>,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user._doc;
    const { password, __v, ...account } = user;
    return data ? account[data] : account;
  },
);
