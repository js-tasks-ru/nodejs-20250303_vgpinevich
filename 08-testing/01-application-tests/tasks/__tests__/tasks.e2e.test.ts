import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterAll(async () => await app.close());
  beforeEach(async () => await repository.delete({}));

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      await repository.save([
        { title: "Task 1", description: "Desc 1", isCompleted: false },
        { title: "Task 2", description: "Desc 2", isCompleted: true },
      ]);
      const res = await request(app.getHttpServer()).get("/tasks").expect(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const task = await repository.save({
        title: "Test",
        description: "Test",
        isCompleted: false,
      });
      const res = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200);
      expect(res.body.id).toBe(task.id);
    });

    it("should return 404 if task not found", async () => {
      await request(app.getHttpServer()).get("/tasks/999").expect(404);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app.getHttpServer())
        .post("/tasks")
        .send({
          title: "Test",
          description: "Test Description",
        })
        .expect(201);

      const createdTask = await repository.findOneBy({ id: response.body.id });
      expect(createdTask.title).toBe("Test");
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      const task = await repository.save({
        title: "Original",
        description: "Original",
        isCompleted: false,
      });
      const res = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({ title: "Updated", isCompleted: true })
        .expect(200);
      expect(res.body.title).toBe("Updated");
      expect(res.body.isCompleted).toBe(true);
    });

    it("should return 404 when updating non-existent task", async () => {
      await request(app.getHttpServer())
        .patch("/tasks/999")
        .send({ title: "New" })
        .expect(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      const task = await repository.save({
        title: "Delete",
        description: "Delete",
        isCompleted: false,
      });
      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(200);
      expect(await repository.findOneBy({ id: task.id })).toBeNull();
    });

    it("should return 404 when deleting non-existent task", async () => {
      await request(app.getHttpServer()).delete("/tasks/999").expect(404);
    });
  });
});
