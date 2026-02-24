import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from 'src/infrastructure/mongo/purchase.schema';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel('Purchase') private readonly purchaseModel: Model<Purchase>,
  ) {}

  public async create(
    purchase: Omit<Purchase, '_id' | 'createdAt' | 'updatedAt'>,
  ) {
    return await this.purchaseModel.create(purchase);
  }

  public async getByTransactionId(transaction_id: string) {
    return await this.purchaseModel.findOne({
      transaction_id: transaction_id,
    });
  }

  public async changeStatusById(transaction_id: string, status: string) {
    return await this.purchaseModel.updateOne(
      { transaction_id },
      { $set: { status } },
    );
  }
}
