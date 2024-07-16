
import { Repository } from "typeorm";
import { TaskService } from "./task.service";
import { DeepMockProxy, mockClear, mockDeep } from 'jest-mock-extended';
import { Task } from "./task.model";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";

describe('TaskService', () => {

    let taskService: TaskService;

    let mockTaskRepository: DeepMockProxy<Repository<Task>>;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                TaskService, {
                    provide: getRepositoryToken(Task),
                    useValue: mockDeep<Repository<Task>>()
                }
            ]
        }).compile();
        taskService = moduleRef.get<TaskService>(TaskService)
        mockTaskRepository = moduleRef.get(getRepositoryToken(Task))
    })

    describe('createTask', () => {

        it('Should create a new task and add it to the tasks array', async () => {
            const title = "Test Task"
            const mockTask = { id: 1, _id: new ObjectId(), title, completed: false }

            mockTaskRepository.create.mockReturnValue(mockTask);
            mockTaskRepository.save.mockResolvedValue(mockTask);

            const task = await taskService.createTask(title)
            expect(task).toBeDefined()
            expect(task.title).toBe(title)
            expect(task.completed).toBe(false)
            expect(mockTaskRepository.create).toHaveBeenCalledWith({ title, completed: false })
            expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask)
        })
    })

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {

            const mockTask1 = { id: 1, _id: new ObjectId(), title: 'Task 1', completed: false }
            const mockTask2 = { id: 2, _id: new ObjectId(), title: 'Task 2', completed: false }


            mockTaskRepository.find.mockResolvedValue([mockTask1, mockTask2])

            const tasks = await taskService.getAllTasks()
            expect(tasks).toEqual([mockTask1, mockTask2])
            expect(mockTaskRepository.find).toHaveBeenCalled()
        })
    })


    describe('getTaskById', () => {


        it('should return the task with the given id', async () => {

            const mockTask1 = { id: 1, _id: new ObjectId(), title: 'Task 1', completed: false }
            mockTaskRepository.findOne.mockResolvedValue(mockTask1);
            const task = await taskService.getTaskById(mockTask1._id.toString())
            expect(task).toBe(mockTask1)
        })

        it('should throw an error if the task does not exist', async () => {


            mockTaskRepository.findOne.mockResolvedValue(null);
            await expect(taskService.getTaskById('999')).rejects.toThrow('Task not found')

        })

    })

    describe('updateTask', () => {
        it('should update the task correctly', async () => {
            const mockTask1 = { id: 1, _id: new ObjectId(), title: 'Task 1', completed: false }

            mockTaskRepository.update.mockResolvedValue({ raw: {}, affected: 1, generatedMaps: [] })// Simulate successful update

            mockTaskRepository.findOne.mockResolvedValue({ ...mockTask1, title: 'Updated task', completed: true })

            const updatedTask = await taskService.updateTask(mockTask1._id.toString(), { title: 'Updated task', completed: true })

            expect(updatedTask.completed).toBe(true)
            expect(updatedTask.title).toBe('Updated task')


        })

        it('should throw an error if the task does not exist', async () => {
            mockTaskRepository.update.mockResolvedValue({ raw: {}, affected: 1, generatedMaps: [] })// Simulate successful update
            mockTaskRepository.findOne.mockResolvedValue(null)

            await expect(taskService.updateTask('999', { title: 'Task Updates', completed: true })).rejects.toThrow('Task not found')
        })
    })

    describe('deleteTask', () => {
        it('should delete the task correctly', async () => {
            const mockTaskId = new ObjectId().toString(); // Simulating MongoDB's ObjectId as string
            mockTaskRepository.delete.mockResolvedValue({ raw: {}, affected: 1 }); // Simulate successful deletion

            await taskService.deleteTask(mockTaskId);
            expect(mockTaskRepository.delete).toHaveBeenCalledWith(mockTaskId);
        });

        it('should throw an error if the task does not exist', async () => {
            const mockTaskId = new ObjectId().toString(); // Simulating MongoDB's ObjectId as string
            mockTaskRepository.delete.mockResolvedValue({ raw: {}, affected: 0 }); // Simulate task not found

            await expect(taskService.deleteTask(mockTaskId)).rejects.toThrow('Task not found');
        });
    });
})