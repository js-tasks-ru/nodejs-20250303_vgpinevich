import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import {  TaskId } from "./task.model";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { CreateTaskDto } from "./dto/create-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() inTask: CreateTaskDto) {
    return this.tasksService.create(inTask);
  }

  @Get()
  findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.tasksService.findAll(page, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: TaskId) {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: TaskId, @Body() inTask: UpdateTaskDto) {
    return this.tasksService.update(id, inTask);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: TaskId) {
    await this.tasksService.remove(id);
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
