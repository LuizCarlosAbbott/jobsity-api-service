import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { UserProfile } from '../profile.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: false, type: mongooseSchema.Types.ObjectId })
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: UserProfile })
  profile: number;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: false })
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
