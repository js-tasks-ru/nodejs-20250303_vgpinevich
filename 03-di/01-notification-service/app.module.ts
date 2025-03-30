import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [TasksModule, ConfigModule.forRoot(), LoggerModule],
  providers: [LoggerService],
})
export class AppModule {}
