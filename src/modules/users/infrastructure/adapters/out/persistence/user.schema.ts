import { Schema, model } from 'mongoose';

export interface UserDocument {
  _id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    fullName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, required: true, default: () => new Date() }
  },
  { _id: false, versionKey: false }
);

export const UserModel = model<UserDocument>('User', UserSchema);
