import { Request, Response, NextFunction } from "express";
import config from "config";
import { ValidationError } from "joi";
import CustomErrorHandler from "../services/ErrorHandler";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    type: "server_error",
    ...(config.get<boolean>("DEBUG_MODE") && {
      original_error: err.message,
    }),
  };

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      type: err.type,
      message: err.message,
    };
  }

  if (err.code === 11000 || err.code === 11001) {
    statusCode = 403;
    const field = Object.keys(err.keyValue)[0];
    data = {
      type: "unique",
      message: `${field} '${err.keyValue[field]}' already exists`,
    };
  }

  if (err.name === "ValidationError") {
    statusCode = 403;
    data = { type: err.type, message: err.message };
  }

  if (err instanceof ValidationError) {
    statusCode = 403;
    data = { type: "validation", message: err.details[0].message };
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
