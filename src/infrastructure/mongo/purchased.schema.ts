import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';
export type ProductDocument = Purchased & Document;

@Schema()
export class Purchased {
  @Prop({ required: true, unique: true, default: () => v4() })
  id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PurchasedSchema = SchemaFactory.createForClass(Purchased);
