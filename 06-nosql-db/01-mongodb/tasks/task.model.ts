import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;

const DESCRIPTION_MAX_LENGTH = 1000;

export class CreateTask {
  @IsString()
  @MinLength(TITLE_MIN_LENGTH)
  @MaxLength(TITLE_MAX_LENGTH)
  title: string;

  @IsString()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class UpdateTask {
  @IsString()
  @IsOptional()
  @MinLength(TITLE_MIN_LENGTH)
  @MaxLength(TITLE_MAX_LENGTH)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
