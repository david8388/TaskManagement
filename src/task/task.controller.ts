import { Controller, Get, Post, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    getAllTasks(): Task[] {
        return this.taskService.getAllTasks()
    }

    @Post()
    createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
        return this.taskService.createTask(createTaskDTO)
    }
}
