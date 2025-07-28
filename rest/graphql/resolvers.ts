import { UserInputData } from "./types/user-input-data";
import { User } from "../models/user";
import { hash } from "bcryptjs";

const Resolvers = {
  createUser: async ({ userInput }: { userInput: UserInputData }, req: unknown) => {
    const existingUser = await User.findOne({ email: userInput.email });
    if(existingUser) {
      throw new Error('User exists already!');
    }
    const hashedPassword = await hash(userInput.password, 12);
    const user = await new User({ email: userInput.email, password: hashedPassword, name: userInput.name }).save();
    return { ...user.toObject(), _id: user._id.toString() };
  },

  hello: () => 'Hello World!'
};

export default Resolvers;
