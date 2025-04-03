import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`);
    next();
  }
}
