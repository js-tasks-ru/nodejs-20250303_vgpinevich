import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InternalAuthDto } from "./models/login.model";
import { Response } from "express";
import { JwtGuard } from "./jwt.guard";
import { AuthGuard } from "@nestjs/passport";
import { Profile } from "passport-google-oauth20";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  private respondWithJwt(res: Response, jwt: string) {
    return res.json({ authToken: jwt });
  }

  @UseGuards(AuthGuard("google"))
  @Get("google")
  google() {
    return "ok";
  }

  @UseGuards(AuthGuard("google"))
  @Get("google/callback")
  async googleCallback(@Request() req) {
    const jwt = await this.authService.getAuthToken(req.user.id);

    // Return an HTML payload that:
    // 1) Displays a message,
    // 2) Stores the token in localStorage,
    // 3) Redirects to /auth/profile.
    return `
    <html>
      <head>
        <title>Login Callback</title>
      </head>
      <body>
        <p>wait until login is complete</p>
        <script>
          localStorage.setItem('token', '${jwt}');
          window.location.href = '/';
        </script>
      </body>
    </html>
  `;
  }

  @UseGuards(JwtGuard)
  @Get("profile")
  profile(@Request() request) {
    return request.user;
  }

  @Post("login")
  async login(@Body() inAuth: InternalAuthDto, @Res() res: Response) {
    const jwt = await this.authService.login(inAuth);

    this.respondWithJwt(res.status(200), jwt);
  }

  @Post("signUp")
  async signUp(@Body() inAuth: InternalAuthDto, @Res() res: Response) {
    const jwt = await this.authService.signUp(inAuth);

    return this.respondWithJwt(res.status(201), jwt);
  }
}
