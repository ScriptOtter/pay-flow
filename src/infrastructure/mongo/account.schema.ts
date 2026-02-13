import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';
import { Purchased } from './purchased.schema';
export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ required: true, unique: true, default: () => v4() })
  id: string;

  @Prop({ required: true, minlength: 6 })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true, minlength: 6, maxLength: 32 })
  login: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: false, type: [Purchased], default: [] })
  purchases?: Purchased[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
