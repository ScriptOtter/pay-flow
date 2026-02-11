import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

enum STATUS_TRANSACTION {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

@Schema()
export class Transaction {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  metaData: {}[];

  @Prop({ enum: STATUS_TRANSACTION })
  status: STATUS_TRANSACTION;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
