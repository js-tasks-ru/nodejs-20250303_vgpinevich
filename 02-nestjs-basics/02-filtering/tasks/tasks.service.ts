import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskQuery, TaskStatus } from "./task.model";

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  private filterByStatus(status: Task['status']) {
    return this.tasks.filter((task) => task.status === status);
  }

  // using default limit 10 to avoid accidentally overloading our "DB"
  private getTasksOnPage(tasks: Task[], page: TaskQuery['page'], limit: TaskQuery['limit'] = 10) {
    if (page) {
      const sliceStart = (page - 1) * limit

      return tasks.slice(sliceStart, sliceStart + limit);
    }

    return tasks;
  }

  getFilteredTasks({
    status,
    page,
    limit}: TaskQuery
  ): Task[] {
    const tasks = status ? this.filterByStatus(status) : this.tasks;

    return this.getTasksOnPage(tasks, page, limit);
  }
}
