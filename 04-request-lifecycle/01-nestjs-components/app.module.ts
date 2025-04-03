import { Logger, Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [TasksModule],
  providers: [Logger]
})
export class AppModule {}
