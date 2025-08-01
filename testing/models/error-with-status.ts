export type ErrorWithStatus = Error & {
  statusCode?: number;
  payload?: any;
};
