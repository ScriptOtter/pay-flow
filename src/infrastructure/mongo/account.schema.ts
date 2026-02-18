import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Purchase } from './purchase.schema';
import { v4 } from 'uuid';
export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ required: true, unique: true, default: () => v4() })
  _id: string;
  @Prop({ required: true, minlength: 6 })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true, minlength: 6, maxLength: 32 })
  login: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: false, type: [Purchase], default: [] })
  purchases?: Purchase[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
