import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { isProd } from "./utils/utils";

const isDebugMode = !isProd()

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: isDebugMode,
      logging: isDebugMode,
    }),
  ],
})
export class AppModule {}
