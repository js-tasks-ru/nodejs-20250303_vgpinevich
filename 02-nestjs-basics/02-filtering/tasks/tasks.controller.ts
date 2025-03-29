import { Controller, Get, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TaskQuery, TaskStatus } from "./task.model";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() query: TaskQuery,
  ) {
    return this.tasksService.getFilteredTasks(query);
  }
}
