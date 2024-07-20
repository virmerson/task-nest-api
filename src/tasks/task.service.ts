import { Injectable } from "@nestjs/common";
import { Task } from "./task.model";
import { Repository } from "typeorm";
import { ObjectId } from "mongodb";
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
        try {
            const result = await this.taskRepository.update(new ObjectId(id), taskUpdate)
            if (result.affected === 0) {
                throw new Error('Task not found')
            }

            const updatedTask = await this.taskRepository.findOne({ where: { _id: new ObjectId(id) } });
            if (!updatedTask) {
                // In case the task still cannot be found after update
                throw new Error('Task not found');
            }
            return updatedTask;
        } catch (error) {
            console.error(`Error updating task with id ${id}`, error)
            throw error
        }
    }

    async getTaskById(id: string): Promise<Task> {

        const task = await this.taskRepository.findOne({ where: { _id: new ObjectId(id) } })
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