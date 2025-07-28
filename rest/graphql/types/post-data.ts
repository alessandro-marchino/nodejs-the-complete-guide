import { GraphQLPost } from "./post";

export interface GraphQLPostData {
  posts: GraphQLPost[];
  totalPosts: number;
}
