import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ObjectId } from "mongoose";
import { ObjectIDPipe } from "../objectid/objectid.pipe";
import { CreateTask, UpdateTask } from "./task.model";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTask) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ObjectIDPipe) id: ObjectId) {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ObjectIDPipe) id: ObjectId,
    @Body() updateTaskDto: UpdateTask,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  async remove(@Param("id", ObjectIDPipe) id: ObjectId) {
    await this.tasksService.remove(id);
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
