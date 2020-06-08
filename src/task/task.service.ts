import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
    private tasks = []

    getAllTasks() {
        return this.tasks
    }
}
