import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type UserStockDocument = UserStock & Document;

@Schema()
export class UserStock {
  @Prop({ required: false, type: mongooseSchema.Types.ObjectId })
  id: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  Symbol: string;

  @Prop()
  Date: string;

  @Prop()
  Time: string;

  @Prop()
  Open: string;

  @Prop()
  High: string;

  @Prop()
  Low: string;

  @Prop()
  Close: string;

  @Prop()
  Volume: string;

  @Prop()
  Name: string;
}

export const UserStockSchema = SchemaFactory.createForClass(UserStock);
