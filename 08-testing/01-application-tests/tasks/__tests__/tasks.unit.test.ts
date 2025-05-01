import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

describe("TasksService", () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const baseTask: Task = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    isCompleted: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTasksRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "Test Task",
        description: "Test Description",
      };

      mockTasksRepository.create.mockReturnValue(baseTask);
      mockTasksRepository.save.mockResolvedValue(baseTask);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(baseTask);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      mockTasksRepository.find.mockResolvedValue([baseTask]);
      expect(await service.findAll()).toEqual([baseTask]);
    });
  });

  describe("findOne", () => {
    it("should return a task", async () => {
      mockTasksRepository.findOneBy.mockResolvedValue(baseTask);
      expect(await service.findOne(1)).toEqual(baseTask);
    });

    it("should throw NotFoundException", async () => {
      mockTasksRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a task", async () => {
      const updateDto: UpdateTaskDto = { title: "Updated Title" };
      const updatedTask = { ...baseTask, ...updateDto };

      jest.spyOn(service, "findOne").mockResolvedValue(baseTask);
      mockTasksRepository.save.mockResolvedValue(updatedTask);

      expect(await service.update(1, updateDto)).toEqual(updatedTask);
    });
  });

  describe("remove", () => {
    it("should remove a task", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(baseTask);
      await service.remove(1);
      expect(mockTasksRepository.remove).toHaveBeenCalledWith(baseTask);
    });
  });
});
