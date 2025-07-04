export function defaultHandleError(message, next, status = 500) {
  const err = new Error(message);
  err.httpStatusCode = status;
  return next(err);
}
