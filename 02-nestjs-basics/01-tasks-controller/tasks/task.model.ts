import { IsIn, IsString } from "class-validator";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface ITask {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export class Task implements ITask {
  @IsString()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS])
  status: TaskStatus;
}
