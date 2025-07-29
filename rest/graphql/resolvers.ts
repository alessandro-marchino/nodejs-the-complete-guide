import { GraphQLUserInputData } from "./types/user-input-data";
import { GraphQLPostInputData } from "./types/post-input-data";
import { User } from "../models/user";
import { compare, hash } from "bcryptjs";
import { isEmpty, isEmail, isLength } from "validator";
import { ErrorWithStatus } from "../models/error-with-status";
import { sign } from "jsonwebtoken";
import { env } from "process";
import { Post } from "../models/post";
import { Types } from "mongoose";

const PER_PAGE = 2;

const Resolvers = {
  createUser: async ({ userInput }: { userInput: GraphQLUserInputData }) => {
    const errors = [];
    if(!isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid' });
    }
    if(isEmpty(userInput.password) || !isLength(userInput.password, { min: 5 })) {
      errors.push({ message: 'Password too short' });
    }
    if(isEmpty(userInput.name)) {
      errors.push({ message: 'Name must not be empty' });
    }
    if(errors.length) {
      const e: ErrorWithStatus = new Error('Invalid input');
      e.payload = errors;
      e.statusCode = 422;
      throw e;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if(existingUser) {
      throw new Error('User exists already!');
    }
    const hashedPassword = await hash(userInput.password, 12);
    const user = await new User({ email: userInput.email, password: hashedPassword, name: userInput.name }).save();
    return { ...user._doc, _id: user._id.toString() };
  },
  createPost: async({ postInput }: { postInput: GraphQLPostInputData }, req: GraphQL.Context) => {
    if(!req.isAuth) {
      const e: ErrorWithStatus = new Error('Not authenticated!');
      e.statusCode = 401;
      throw e;
    }

    const errors = [];
    if(isEmpty(postInput.title) || !isLength(postInput.title, { min: 5 })) {
      errors.push({ message: 'Title too short' });
    }
    if(isEmpty(postInput.content) || !isLength(postInput.content, { min: 5 })) {
      errors.push({ message: 'Content too short' });
    }
    if(errors.length) {
      const e: ErrorWithStatus = new Error('Invalid input');
      e.payload = errors;
      e.statusCode = 422;
      throw e;
    }

    // if(!req.file) {
    //   const error: ErrorWithStatus = new Error('No file provided.');
    //   error.statusCode = 422;
    //   throw error;
    // }

    const creator = await User.findById(req.userId);
    if(!creator) {
      const e: ErrorWithStatus = new Error('Invalid user');
      e.statusCode = 401;
      throw e;
    }
    const post = await new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator
    }).save();
    creator.posts.push(post._id);
    await creator.save();
    return { ...post._doc, _id: post._id.toString(), createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString()};
  },

  login: async ({ email, password }: { email: string, password: string}) => {
    const user = await User.findOne({ email: email });
    if(!user) {
      const error: ErrorWithStatus = new Error('Login error.');
      error.statusCode = 401;
      throw error;
    }
    const isEquals = await compare(password, user.password);
    if(!isEquals) {
      const error: ErrorWithStatus = new Error('Login error.');
      error.statusCode = 401;
      throw error;
    }
    // Correct password
    const token = sign(
      { email: user.email, userId: user._id.toString() },
      env.JWT_PRIVATE_KEY!,
      { expiresIn: '1h' }
    );
    return { token, userId: user._id.toString() };
  },
  posts: async ({ page }: { page?: number }, req: GraphQL.Context) => {
    if(!req.isAuth) {
      const e: ErrorWithStatus = new Error('Not authenticated!');
      e.statusCode = 401;
      throw e;
    }
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(((page || 1) - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .populate('creator');
    return {
      posts: posts.map(p => ({ ...p._doc, _id: p._id.toString(), createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() })),
      totalPosts
    };
  }
};

export default Resolvers;
