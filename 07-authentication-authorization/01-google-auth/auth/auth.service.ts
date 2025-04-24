import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InternalAuthDto } from "./models/login.model";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtSecretPayload } from "./passport/jwt.model";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  private getJwtByLogin(payload: JwtSecretPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async login(inAuth: InternalAuthDto): Promise<string> {
    const user = await this.userService.findOne(inAuth.login);

    const isPasswordValid = await this.comparePassword(
      inAuth.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return this.getJwtByLogin({ sub: inAuth.login, login: inAuth.login });
  }

  async signUp(inAuth: InternalAuthDto): Promise<string> {
    const user = await this.userService.getUser(inAuth.login);

    if (user) {
      throw new UnauthorizedException("User already exists");
    }

    const hashedPassword = await this.hashPassword(inAuth.password);

    await this.userService.create({
      ...inAuth,
      id: inAuth.login,
      password: hashedPassword,
    });

    return this.getJwtByLogin({ sub: inAuth.login, login: inAuth.login });
  }

  getAuthToken(login: string): Promise<string> {
    return this.getJwtByLogin({ sub: login, login });
  }
}
