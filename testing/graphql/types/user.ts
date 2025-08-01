import { GraphQLPost } from "./post";

export interface GraphQLUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  status: string;
  posts: GraphQLPost[];
}
