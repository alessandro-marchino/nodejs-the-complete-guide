import { Document, model, ObjectId, Schema, Types } from 'mongoose';
import { PostDocument } from './post';

export interface UserInterface {
  password: string;
  email: string;
  name: string;
  status: string;
  posts: Types.ObjectId[] | PostDocument[];
}
export interface UserDocument extends UserInterface, Document<Types.ObjectId> {
  createdAt: Date;
  updatedAt: Date;
  _doc?: any;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'I am new!'
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

export const User = model('User', userSchema);
