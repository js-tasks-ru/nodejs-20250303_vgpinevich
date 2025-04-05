import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

const BAD_REQUEST_ERROR_TYPES = [
  mongoose.mongo.MongoError,
  mongoose.Error.ValidationError,
];

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  private readonly statusMessages: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
  };

  private getStatusCode(exception: Error): number {
    if ("status" in exception && typeof exception.status === "number") {
      return exception.status;
    }

    if (
      BAD_REQUEST_ERROR_TYPES.some((instance) => exception instanceof instance)
    ) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(exception: any, host: ArgumentsHost) {
    const { message } = exception;
    let statusCode = this.getStatusCode(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(statusCode).json({
      statusCode,
      message,
      error: this.statusMessages[statusCode] || `Error code ${statusCode}`,
    });
  }
}
