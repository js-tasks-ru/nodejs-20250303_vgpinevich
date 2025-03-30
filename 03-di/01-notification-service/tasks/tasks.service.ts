import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateTaskDto,
  Task,
  TaskStatus,
  TaskTypes,
  UpdateTaskDto,
} from "./task.model";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
  ) {}

  private getCreateTaskNotificationText({ title }: CreateTaskDto): string {
    return `Вы назначены ответственным за задачу: "${title}"`;
  }

  private getUpdateTaskNotificationText({
    title,
    status,
  }: UpdateTaskDto): string {
    return `Статус задачи "${title}" обновлён на "${status}"`;
  }
  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };

    const { email } = this.userService.getUserById(task.assignedTo);

    this.tasks.push(task);

    this.notificationsService.sendEmail(
      email,
      TaskTypes.newTask,
      this.getCreateTaskNotificationText(task),
    );

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    const { phone } = this.userService.getUserById(task.assignedTo);

    Object.assign(task, updateTaskDto);

    this.notificationsService.sendSMS(
      phone,
      this.getUpdateTaskNotificationText(task),
    );

    return task;
  }
}
