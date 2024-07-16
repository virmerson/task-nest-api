import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { TaskService } from './task.service'
import { Task } from './task.model'

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {

    }
    @Get()
    async getAllTasks(): Promise<Task[]> {
        return this.taskService.getAllTasks()
    }

    @Get(':id')
    async getTaskById(@Param('id') id: string): Promise<Task> {
        return this.taskService.getTaskById(id)
    }

    @Patch(':id')
    async updateTask(@Param('id') id: string, @Body() taskUpdate: Partial<Task>): Promise<Task> {
        return this.taskService.updateTask(id, taskUpdate)
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string): Promise<void> {
        this.taskService.deleteTask(id)
    }
    @Post()
    async createTask(@Body('title') title: string): Promise<Task> {
        return this.taskService.createTask(title)
    }
}
