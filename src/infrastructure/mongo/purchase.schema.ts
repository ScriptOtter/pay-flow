import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

export type ProductDocument = Purchase & Document;
export enum STATUS_TRANSACTION {
  SUCCEEDED = 'succeeded',
  WAITING = 'waiting_for_capture',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}
@Schema()
export class Purchase {
  @Prop({ required: true, unique: true, default: () => v4() })
  _id: string;
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  transaction_id: string;

  @Prop({ enum: STATUS_TRANSACTION })
  status: STATUS_TRANSACTION;

  @Prop({ required: true })
  price: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
