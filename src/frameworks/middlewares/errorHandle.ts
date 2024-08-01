import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CostumeError } from "./customError";

const errorHandle: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error instanceof CostumeError ? error.statusCode : 500;
  const message =
    error instanceof CostumeError
      ? error.message
      : "oops! something went wrong";
  console.error("Handler error:", error.message);
  return res.status(statusCode).send(`${message}`);
};

export default errorHandle;
