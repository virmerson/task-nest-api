import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { TaskService } from './task.service'
import { Task } from './task.model'

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {

    }
    @Get()
    getAllTasks(): Task[] {
        return this.taskService.getAllTasks()
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(+id)
    }
    @Patch(':id')
    updateTask(@Param('id') id: string, @Body() taskUpdate: Partial<Task>): Task {
        return this.taskService.updateTask(+id, taskUpdate)
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string): void {
        this.taskService.deleteTask(+id)
    }
    @Post()
    createTask(@Body('title') title: string): Task {
        return this.taskService.createTask(title)
    }



}
