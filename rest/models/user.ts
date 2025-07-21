import { model, Schema } from 'mongoose';

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
  post: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

export const User = model('User', userSchema);
