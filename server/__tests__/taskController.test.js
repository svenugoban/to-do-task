const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const taskController = require('../controllers/taskController');
const Task = require('../models/taskModel');

jest.mock('../models/taskModel');

const app = express();
app.use(bodyParser.json());

app.post('/tasks', taskController.createTask);
app.get('/tasks', taskController.getAllTasks);
app.get('/tasks/:id', taskController.getTaskById);
app.put('/tasks/:id', taskController.updateTask);
app.delete('/tasks/:id', taskController.deleteTask);

describe('Task Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('POST /tasks', () => {
    it('should create a task', async () => {
      Task.create.mockResolvedValue(1);

      const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Desc',
        status: 'pending'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(Task.create).toHaveBeenCalled();
    });

    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/required/);
    });
  });

  describe('GET /tasks', () => {
    it('should return the 5 most recent pending tasks', async () => {
      const mockTasks = [
        { id: 1, status: 'pending', created_at: '2024-04-01' },
        { id: 2, status: 'pending', created_at: '2024-04-02' },
        { id: 3, status: 'done', created_at: '2024-04-03' },
        { id: 4, status: 'pending', created_at: '2024-04-04' },
        { id: 5, status: 'pending', created_at: '2024-04-05' },
        { id: 6, status: 'pending', created_at: '2024-04-06' },
      ];
      Task.getAll.mockResolvedValue(mockTasks);
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(5);
      expect(res.body.every(task => task.status === 'pending')).toBe(true);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return task by id', async () => {
      Task.getById.mockResolvedValue({ id: 1, title: 'Task 1' });
      const res = await request(app).get('/tasks/1');
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Task 1');
    });

    it('should return 404 if not found', async () => {
      Task.getById.mockResolvedValue(null);
      const res = await request(app).get('/tasks/999');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task when completedBy is provided', async () => {
      Task.update.mockResolvedValue();
      const res = await request(app).put('/tasks/1').send({
        status: 'completed',
        completedBy: 'User A'
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task updated successfully');
    });

    it('should return 400 if completedBy is missing', async () => {
      const res = await request(app).put('/tasks/1').send({ status: 'completed' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/completedBy/);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task', async () => {
      Task.delete.mockResolvedValue();
      const res = await request(app).delete('/tasks/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted successfully');
    });
  });
});
