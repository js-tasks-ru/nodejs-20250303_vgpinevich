import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { map } from "rxjs";

export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const startTime = performance.now();

    return next.handle().pipe(
      map((data) => {
        data["apiVersion"] = "1.0";
        data["executionTime"] =
          Math.round(performance.now() - startTime) + "ms";

        return data;
      }),
    );
  }
}
