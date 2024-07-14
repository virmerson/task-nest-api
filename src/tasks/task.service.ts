import { Injectable } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TaskService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks;
    }
    createTask(title: string): Task {
        const newTask: Task = {
            id: Date.now(),
            title,
            completed: false
        }
        this.tasks.push(newTask);
        return newTask;
    }

}