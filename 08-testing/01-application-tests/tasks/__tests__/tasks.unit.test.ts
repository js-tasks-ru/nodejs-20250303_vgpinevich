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
        title: "Test",
        description: "Test Description",
      };
      const mockTask = {
        id: 1,
        ...createTaskDto,
        isCompleted: false,
      };

      mockTasksRepository.create.mockReturnValue(mockTask);
      mockTasksRepository.save.mockResolvedValue(mockTask);
      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Test",
          description: "Test",
          isCompleted: false,
        },
      ];
      mockTasksRepository.find.mockResolvedValue(mockTasks);
      const result = await service.findAll();
      expect(result).toEqual(mockTasks);
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      const mockTask = {
        id: 1,
        title: "Test",
        description: "Test",
        isCompleted: false,
      };
      mockTasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
    });

    it("should throw NotFoundException when task does not exist", async () => {
      mockTasksRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const existingTask = {
        id: 1,
        title: "Original",
        description: "Original",
        isCompleted: false,
      };
      const updateDto: UpdateTaskDto = { title: "Updated", isCompleted: true };

      jest.spyOn(service, "findOne").mockResolvedValue(existingTask);
      mockTasksRepository.save.mockResolvedValue({
        ...existingTask,
        ...updateDto,
      });
      const result = await service.update(1, updateDto);
      expect(result.title).toBe("Updated");
      expect(result.isCompleted).toBe(true);
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      jest.spyOn(service, "findOne").mockRejectedValue(new NotFoundException());
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      const mockTask = {
        id: 1,
        title: "Test",
        description: "Test",
        isCompleted: false,
      };
      jest.spyOn(service, "findOne").mockResolvedValue(mockTask);
      await service.remove(1);
      expect(mockTasksRepository.remove).toHaveBeenCalledWith(mockTask);
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      jest.spyOn(service, "findOne").mockRejectedValue(new NotFoundException());
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
