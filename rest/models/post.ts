import { Document, model, Schema, Types } from 'mongoose';
import { UserDocument } from './user';

export interface PostInterface {
  title: string;
  imageUrl: string;
  content: string;
  creator: UserDocument | Types.ObjectId;
}
export interface PostDocument extends PostInterface, Document<Types.ObjectId> {
  createdAt: Date;
  updatedAt: Date;
  _doc?: any;
}

const postSchema = new Schema<PostDocument>({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

export const Post = model('Post', postSchema);
