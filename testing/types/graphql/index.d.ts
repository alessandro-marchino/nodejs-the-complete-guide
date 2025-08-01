export {}

declare global {
  namespace GraphQL {
    export interface Context {
      isAuth?: boolean;
      userId?: string;
    }
  }
}
