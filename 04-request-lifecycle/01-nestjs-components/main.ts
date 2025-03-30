import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger, Logger } from "@nestjs/common";
import { LoggingMiddleware } from "./middlewares/logging.middleware";
import { RolesGuard } from "./guards/roles.guard";
import { ApiVersionInterceptor } from "./interceptors/api-version.interceptor";
import { HttpErrorFilter } from "./filters/http-error.filter";

async function bootstrap() {
  const logger =  new Logger();

  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.use(new LoggingMiddleware().use)
  app.useGlobalGuards(new RolesGuard());
  app.useGlobalInterceptors(new ApiVersionInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
