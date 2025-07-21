import { Document, model, Schema, Types } from 'mongoose';

const postSchema = new Schema({
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
export type PostType = Document<unknown, {}, { title: string; imageUrl: string; content: string; creator: Types.ObjectId; }, {}> & {
  _id: Types.ObjectId;
  title: string;
  imageUrl: string;
  content: string;
  creator: Types.ObjectId;
};
