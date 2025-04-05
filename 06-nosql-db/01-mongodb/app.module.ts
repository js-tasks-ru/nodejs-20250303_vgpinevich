import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/05-db-02-mongodb"),
    TasksModule,
  ],
})
export class AppModule {}
