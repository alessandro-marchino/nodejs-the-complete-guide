import { UserInputData } from "./types/user-input-data";
import { User } from "../models/user";
import { compare, hash } from "bcryptjs";
import { isEmpty, isEmail, isLength } from "validator";
import { ErrorWithStatus } from "../models/error-with-status";
import { sign } from "jsonwebtoken";
import { env } from "process";

const Resolvers = {
  createUser: async ({ userInput }: { userInput: UserInputData }, req: unknown) => {
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
  }
};

export default Resolvers;
