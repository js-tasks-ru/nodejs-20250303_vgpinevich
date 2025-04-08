import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { MongooseModule } from "@nestjs/mongoose";

const DB_CONNECTION_ROUTE = process.env.MONGODB_URL || "mongodb://localhost:27017/05-db-02-mongodb";


@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECTION_ROUTE),
    TasksModule
  ]
})
export class AppModule {
}
