import {
  Body, ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.model";
import { IsNumber, IsNumberString } from "class-validator";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get(":id")
  getTaskById(@Param("id") id: Task['id']): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() task: Omit<Task, 'id'>) {
    return this.tasksService.createTask(task);
  }

  @Patch(":id")
  updateTask(@Param("id") id: Task['id'], @Body() task: Task) {
    return this.tasksService.updateTask(id, task);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: Task['id']) {
    return this.tasksService.deleteTask(id);
  }
}
