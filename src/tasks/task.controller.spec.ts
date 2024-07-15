import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { Task } from "./task.model";
import { title } from "process";


describe('TaskController', () => {

    let taskController: TaskController
    let taskService: TaskService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [{
                provide: TaskService,
                useValue: {
                    getAllTasks: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Task' }]),
                    getTaskById: jest.fn().mockImplementation((id: number) => ({ id, title: `Task ${id}` })),
                    updateTask: jest.fn().mockImplementation((id: number, taskUpdate: Partial<Task>) => ({ id, ...taskUpdate })),
                    deleteTask: jest.fn().mockResolvedValue(undefined),
                    createTask: jest.fn().mockImplementation((title: string) => ({ id: Date.now(), title }))
                }
            }]
        }).compile();

        taskController = module.get<TaskController>(TaskController)
        taskService = module.get<TaskService>(TaskService)
    })


    it('should return an array of tasks ', async () => {
        expect(await taskController.getAllTasks()).toEqual([{ id: 1, title: 'Test Task' }])

    })

    it('should return a specific task by ID', async () => {
        const taskId = 1;
        expect(await taskController.getTaskById(taskId.toString())).toEqual({
            id: taskId, title: `Task ${taskId}`
        })
    })

    it('should update a task correctly ', async () => {
        const taskId = 1;
        const taskUpdate = { title: 'Updated Task' }
        expect(await taskController.updateTask(taskId.toString(), taskUpdate)).toEqual({ id: taskId, ...taskUpdate })
    })

    it('should delete a task correctly ', async () => {
        const taskId = 1;
        await taskController.deleteTask(taskId.toString())
        expect(taskService.deleteTask).toHaveBeenCalledWith(taskId)

    })

    it('should create a new task correctly', async () => {
        const taskTitle = 'New Task';
        const newTask = await taskController.createTask(taskTitle);
        expect(newTask).toHaveProperty('id')
        expect(newTask.title).toBe(taskTitle)

    })
})