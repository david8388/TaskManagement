import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe('TaskService', () => {
  let taskService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = await module.get<TaskService>(TaskService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('Some value');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDTO = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await taskService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('Some value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create task', () => {
    it('calls taskRepository.createTask and return the task', async () => {
      taskRepository.createTask.mockResolvedValue('some task');
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const task: CreateTaskDTO = {
        title: 'Test task',
        description: 'Test desc',
      };
      const result = await taskService.createTask(task, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(task, mockUser);
      expect(result).toEqual('some task');
    });
  });
});
