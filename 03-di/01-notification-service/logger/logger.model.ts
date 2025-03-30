export enum LoggerLevelPriority {
  "log",
  "warn",
  "error",
}

export enum LogLevel {
  "log" = "log",
  "warn" = "warn",
  "error" = "error",
}

export const MAP_LOG_LEVEL_PRIORITY: Readonly<Record<LogLevel, LoggerLevelPriority>> = {
  [LogLevel.log]: LoggerLevelPriority.log,
  [LogLevel.warn]: LoggerLevelPriority.warn,
  [LogLevel.error]: LoggerLevelPriority.error,
};
