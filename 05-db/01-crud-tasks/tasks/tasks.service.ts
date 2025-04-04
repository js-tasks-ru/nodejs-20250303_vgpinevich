import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { DataSource, Repository } from "typeorm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private dataSource: DataSource,
  ) {}

  async create(inTask: CreateTaskDto) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      return transactionalEntityManager.save(Task, inTask);
    });
  }

  async findAll(inPage = DEFAULT_PAGE, inLimit = DEFAULT_LIMIT) {
    const limit = Math.min(inLimit, MAX_LIMIT);

    const skip = (inPage - 1) * limit;

    return this.taskRepository.find({
      order: { id: "ASC" },
      skip,
      take: limit,
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
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const task = await transactionalEntityManager.preload(Task, {
        id,
        ...updateTaskDto,
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return transactionalEntityManager.save(Task, task, { reload: true });
    });
  }

  async remove(id: number): Promise<void> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.delete(Task, id);

      if (!result.affected) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    });
  }
}
