import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { appendFileSync } from "node:fs";

const LOG_FILE = "errors.log"

export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  private logToFile(message: string): void {
    try {
      appendFileSync(LOG_FILE, message + "\n");
    } catch (e) {
      this.logger.log(`appendFileSync exception: ${e}`);
    }
  }

  private getStatusCode(exception: Error): number {
    if ("status" in exception && typeof exception.status === "number") {
      return exception.status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(exception: Error, host: ArgumentsHost) {
    const { message } = exception;
    const statusCode = this.getStatusCode(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const timestamp = new Date().toISOString();

    this.logToFile(`[${timestamp}] ${statusCode} - ${message}`);

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp,
    });
  }
}
