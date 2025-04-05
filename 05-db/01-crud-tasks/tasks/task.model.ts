import { IsBoolean, IsOptional, IsString } from "class-validator";

export type TaskId = number;

export class CreateTask {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class UpdateTask {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
