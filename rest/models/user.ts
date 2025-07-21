import { Document, model, ObjectId, Schema, Types } from 'mongoose';

const userSchema = new Schema({
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
export type UserType = Document<unknown, {}, { password: string; email: string; name: string; status: string; posts: Types.ObjectId[]; }, {}> & {
  _id: Types.ObjectId;
  password: string;
  email: string;
  name: string;
  status: string;
  posts: Types.ObjectId[];
};
