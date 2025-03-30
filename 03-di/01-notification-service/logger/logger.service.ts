import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as process from "node:process";
import {
  LoggerLevelPriority,
  LogLevel,
  MAP_LOG_LEVEL_PRIORITY,
} from "./logger.model";

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();
  }

  private get priority(): LoggerLevelPriority {
    return MAP_LOG_LEVEL_PRIORITY[process.env.LOG_LEVEL || LogLevel.log];
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, stackOrContext?: string) {
    if (this.priority <= LoggerLevelPriority.log) {
      super.log(message, stackOrContext);
    }
  }

  /**
   * Write a 'log' level log.
   */
  warn(message: any, stackOrContext?: string) {
    if (this.priority <= LoggerLevelPriority.warn) {
      super.warn(message, stackOrContext);
    }
  }

  /**
   * Write a 'log' level log.
   */
  error(message: any, stackOrContext?: string) {
    if (this.priority <= LoggerLevelPriority.error) {
      super.error(message, stackOrContext);
    }
  }
}
