import { Injectable } from "@nestjs/common";
import { Task } from "./task.model";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TaskService {

    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {

    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id)
        if (result.affected === 0) {
            throw new Error('Task not found')
        }
    }

    async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task> {
        const result = await this.taskRepository.update(id, taskUpdate)
        if (result.affected === 0) {
            throw new Error('Task not found')
        }

        const updatedTask = await this.taskRepository.findOne({ where: { id: Number(id) } });
        if (!updatedTask) {
            // In case the task still cannot be found after update
            throw new Error('Task not found');
        }
        return updatedTask;
    }

    async getTaskById(id: string): Promise<Task> {

        const task = await this.taskRepository.findOne({ where: { id: Number(id) } })
        if (!task) {
            throw new Error('Task not found')
        }
        return task
    }

    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.find()
    }

    async createTask(title: string): Promise<Task> {
        const newTask = this.taskRepository.create({ title: title, completed: false })
        await this.taskRepository.save(newTask)
        return newTask;
    }

}