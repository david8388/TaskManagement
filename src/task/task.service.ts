import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TaskService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }
}
