class ErrorHandler extends Error {
  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;
  }

  static unAuthorize(message = "unauthorize") {
    return new ErrorHandler(message, 401);
  }
  static notFound(message = "404 Not Found!") {
    return new ErrorHandler(message, 403);
  }
  static serverError(message = "Internal Server Error") {
    return new ErrorHandler(message, 500);
  }
  static error(message = "Not Found!", statusCode = 403) {
    return new ErrorHandler(message, statusCode);
  }
  static errors(
    message = "errors",
    errors = [],
    statusCode = 403,
    type = "any"
  ) {
    return new ErrorHandler(statusCode, message, type, errors);
  }
}

export default ErrorHandler;
