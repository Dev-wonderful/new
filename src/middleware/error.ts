import { NextFunction, Request, Response } from "express";
// import config from "../config";
import logger from "../utils/logger";

class HttpError extends Error {
  status_code: number;
  success: boolean = false;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status_code = statusCode;
  }
}

class BadRequest extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

class Unauthorized extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

class Forbidden extends HttpError {
  constructor(message: string) {
    super(403, message);
  }
}

class Conflict extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

class InvalidInput extends HttpError {
  constructor(message: string) {
    super(422, message);
  }
}

class Expired extends HttpError {
  constructor(message: string) {
    super(410, message);
  }
}

class ServerError extends HttpError {
  constructor(message: string) {
    super(500, message);
  }
}

export class FileValidationError extends HttpError {
  constructor(message: string) {
    super(400, message);
    this.name = "FileValidationError";
  }
}

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route not found: ${req.originalUrl}`;
  logger.error(
    `${req.method} ${req.originalUrl} ${404} - ${req.ip} - Route not found`,
  );
  res.status(404).json({ success: false, message });
  next();
};

const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { success, status_code, message } = err;

  logger.error(
    `${_req.method} ${_req.originalUrl} ${status_code || 500} - ${_req.ip} - ${message}`,
  );

  res.status(status_code).json({
    success,
    message: "server error, this will be resolved shortly!",
  });
};

export {
  BadRequest,
  Conflict,
  errorHandler,
  Forbidden,
  HttpError,
  InvalidInput,
  ResourceNotFound,
  routeNotFound,
  ServerError,
  Unauthorized,
  Expired,
};
