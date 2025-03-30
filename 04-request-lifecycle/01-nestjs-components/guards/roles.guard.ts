import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { UserRoles, USER_ROLE_HEADER } from "./roles.guard.model";

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    const role = req.headers[USER_ROLE_HEADER];

    if (role !== UserRoles.admin) {
      throw new ForbiddenException(
        `Доступ запрещён: требуется роль ${UserRoles.admin}`,
      );
    }

    return true;
  }
}
