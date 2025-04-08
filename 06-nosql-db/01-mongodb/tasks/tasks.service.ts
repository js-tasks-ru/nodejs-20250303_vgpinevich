import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { ClientSession, Connection, Model, ObjectId } from "mongoose";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private TaskModel: Model<Task>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  create(inTask: CreateTaskDto) {
    return this.TaskModel.create(inTask);
  }

  async findAll() {
    return this.TaskModel.find();
  }

  async findOne(id: ObjectId) {
    const result = await this.TaskModel.findById(id);

    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result;
  }

  async update(id: ObjectId, inTask: UpdateTaskDto) {
    const updatedTask = await this.TaskModel.findByIdAndUpdate(
      id,
      inTask,
      { new: true },
    );

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }

  async remove(id: ObjectId) {
    const result = await this.TaskModel.deleteOne(id);

    if (!result.deletedCount) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
