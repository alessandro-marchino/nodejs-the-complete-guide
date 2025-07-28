import { GraphQLUser } from "./user";

export interface GraphQLPost {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  creator: GraphQLUser;
  createdAt: string;
  updatedAt: string;
}
