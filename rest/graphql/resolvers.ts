import { UserInputData } from "./types/user-input-data";
import { User } from "../models/user";
import { hash } from "bcryptjs";
import { isEmpty, isEmail, isLength } from "validator";
import { ErrorWithStatus } from "../models/error-with-status";

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
      const e = new Error('Invalid input') as ErrorWithStatus;
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

  hello: () => 'Hello World!'
};

export default Resolvers;
