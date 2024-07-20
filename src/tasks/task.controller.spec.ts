import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { Task } from "./task.model";


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

                    getTaskById: jest.fn().mockImplementation((id: string) => {
                        if (id !== 'not_found') return { id, title: `Task ${id}` };
                        else throw new Error('Task not found');
                    }),

                    updateTask: jest.fn().mockImplementation((id: string, taskUpdate: Partial<Task>) => {

                        if (id !== 'not_found') return { id, ...taskUpdate }
                        else throw new Error('Task not found')


                    }),

                    deleteTask: jest.fn().mockImplementation(

                        (id: string) => {
                            if (id !== 'not_found') return { id }
                            else throw new Error('Task not found')
                        }

                    ),
                    createTask: jest.fn().mockImplementation((title: string) => ({ id: Date.now().toString(), title }))
                }
            }]
        }).compile();

        taskController = module.get<TaskController>(TaskController)
        taskService = module.get<TaskService>(TaskService)
    })



    describe('getAllTasks', () => {

        it('should return an array of tasks ', async () => {
            expect(taskController.getAllTasks()).resolves.toEqual([{ id: 1, title: 'Test Task' }])

        })

    })

    describe('getTaskById', () => {
        it('should return a task correctly ', async () => {
            const taskId = "1";
            expect(taskController.getTaskById(taskId.toString())).resolves.toEqual({ id: taskId, title: `Task ${taskId}` })
        })

        it('should throw an error if task not found ', async () => {
            const taskId = 'not_found';
            await expect(taskController.getTaskById(taskId)).rejects.toThrow('Task not found')
        })
    })



    describe('UpdateTask', () => {
        it('should update a task correctly ', async () => {
            const taskId = "1";
            const taskUpdate = { title: 'Updated Task' }
            expect(taskController.updateTask(taskId.toString(), taskUpdate)).resolves.toEqual({ id: taskId, ...taskUpdate })
        })

        it('should throw an error if task not found ', async () => {
            const taskId = 'not_found';
            expect(taskController.updateTask(taskId, {})).rejects.toThrow('Task not found')
        })

    })

    describe("DeleteTask", () => {
        it('should delete a task correctly ', async () => {
            const taskId = "1";
            await taskController.deleteTask(taskId.toString())
            expect(taskService.deleteTask).toHaveBeenCalledWith(taskId)
        })

        it('should throw an error if task not found ', async () => {
            const taskId = 'not_found';
            await expect(taskController.deleteTask(taskId)).rejects.toThrow('Task not found')
        })
    })

    describe('CreateTask', () => {
        it('should create a new task correctly', async () => {
            const taskTitle = 'New Task';
            const newTask = await taskController.createTask(taskTitle);
            expect(newTask).toHaveProperty('id')
            expect(newTask.title).toBe(taskTitle)

        })
    })
})