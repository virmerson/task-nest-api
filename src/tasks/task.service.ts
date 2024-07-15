import { Injectable, OnModuleInit } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TaskService {

    private tasks: Task[] = [];

    // onModuleInit() {
    //     //     if (this.tasks.length === 0)
    //     //         this.initTasks()
    // }

    // initTasks() {
    //     Array.from({ length: 10 }, (_, index) => {
    //         this.createTask(`Task ${index + 1}`)
    //     })
    // }
    //complexity O(n)
    deleteTask(id: number): void {
        const taskIndex = this.tasks.findIndex(task => task.id === id)
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }
        this.tasks.splice(taskIndex, 1)

    }

    //complexity O(n)
    updateTask(id: number, taskUpdate: Partial<Task>): Task {

        const taskIndex = this.tasks.findIndex(task => task.id === id)

        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskUpdate }
        return this.tasks[taskIndex]
    }


    //complexity O(n)
    getTaskById(id: number): Task {
        const task = this.tasks.find(task => task.id === id)
        console.log(task)
        console.log(id)
        console.log(typeof id)
        if (!task) {
            throw new Error('Task not found')
        }
        return task;
    }

    //complexity O(1)
    getAllTasks(): Task[] {
        return this.tasks;
    }

    //complexity O(1)
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