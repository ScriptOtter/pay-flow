import { Request } from 'express';
import { Account } from 'src/infrastructure/mongo/account.schema';

declare global {
  namespace Express {
    interface Request {
      user: Account | null;
    }
  }
}
