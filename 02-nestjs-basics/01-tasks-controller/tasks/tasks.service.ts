import { Injectable, NotFoundException } from "@nestjs/common";
import { ITask } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];
  private autoIncrementIndex: number = 0;

  private getTaskIndex(id: ITask['id']):number {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return index;
  }

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTaskById(id: ITask['id']): ITask {
    const index = this.getTaskIndex(id)

    return this.tasks[index];
  }

  createTask(inTask: Omit<ITask, 'id'>): ITask {
    const task: ITask = inTask
    task.id = String(this.autoIncrementIndex++);
    this.tasks.push(task);

    return task;
  }

  updateTask(id: ITask['id'], update: ITask): ITask {
    const index = this.getTaskIndex(id)

    this.tasks[index] = update;

    return update;
  }

  deleteTask(id: ITask['id']): ITask {
    const index= this.getTaskIndex(id)
    const taskToDelete = this.tasks[index]

    this.tasks.splice(index, 1);

    return taskToDelete
  }
}
