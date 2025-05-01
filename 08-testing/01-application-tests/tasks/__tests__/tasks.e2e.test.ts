import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  const testTask = {
    title: "Test Task",
    description: "Test Description",
    isCompleted: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    repository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterAll(async () => await app.close());
  beforeEach(async () => await repository.delete({}));

  describe("POST /tasks", () => {
    it("should create a task (201)", async () => {
      const validPayload = {
        title: "Valid Title",
        description: "Valid Description with minimum 1 character",
      };

      const { body } = await request(app.getHttpServer())
        .post("/tasks")
        .send(validPayload)
        .expect(201);

      expect(body).toMatchObject(validPayload);
    });

    it("should reject invalid data (400)", async () => {
      await request(app.getHttpServer())
        .post("/tasks")
        .send({ title: 123, description: true })
        .expect(400);
    });
  });

  describe("GET /tasks", () => {
    it("should return all tasks (200)", async () => {
      await repository.save([testTask, testTask]);
      const { body } = await request(app.getHttpServer())
        .get("/tasks")
        .expect(200);
      expect(body).toHaveLength(2);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task (200)", async () => {
      const task = await repository.save(testTask);
      const { body } = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200);

      expect(body).toMatchObject(testTask);
    });

    it("should return 404", async () => {
      await request(app.getHttpServer()).get("/tasks/999").expect(404);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update task (200)", async () => {
      const task = await repository.save(testTask);
      const update = { title: "Updated", isCompleted: true };

      const { body } = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send(update)
        .expect(200);

      expect(body).toMatchObject(update);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete task (200)", async () => {
      const task = await repository.save(testTask);
      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(200);

      expect(await repository.findOneBy({ id: task.id })).toBeNull();
    });
  });
});
