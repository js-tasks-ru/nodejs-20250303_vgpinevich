import {
  ExecutionContext,
  Get,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext) {
    try {
      const isValid = await super.canActivate(context);

      if (!isValid) {
        throw Error("not valid");
      }

      return true;
    } catch {
      throw new UnauthorizedException("Forbidden");
    }
  }
}
