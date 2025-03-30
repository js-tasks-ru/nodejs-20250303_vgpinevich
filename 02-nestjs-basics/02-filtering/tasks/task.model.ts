import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export class Task {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS])
  status: TaskStatus;
}

export class TaskQuery {
  @IsOptional()
  @IsNumber()
  @Min(1)
  // transform option in main ValidationPipe config didn't work for some reason
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100) // max limit to avoid heavy requests
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;

  @IsOptional()
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS])
  status?: TaskStatus;
}
