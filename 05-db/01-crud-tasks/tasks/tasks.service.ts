import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {
  }

  async create(inTask: CreateTaskDto) {
    return this.taskRepository.save(inTask);
  }

  async findAll(inPage = DEFAULT_PAGE, inLimit = DEFAULT_LIMIT) {
    const limit = Math.min(inLimit, MAX_LIMIT);

    const skip = (inPage - 1) * limit;

    return this.taskRepository.find({
      order: { id: "ASC" },
      skip,
      take: limit
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.taskRepository.save(task, { reload: true });
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
