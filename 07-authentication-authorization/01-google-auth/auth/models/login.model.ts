import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../../users/entities/user.entity";
import { Column } from "typeorm";

export class InternalAuthDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  login: string;

  @IsString()
  @MinLength(6)
  @MaxLength(24)
  password: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  displayName: string;
}
