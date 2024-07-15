import { timeLog } from "console";
import { TaskService } from "./task.service";

describe('TaskService', () => {

    let taskService: TaskService;
    beforeEach(() => {
        taskService = new TaskService();
    })

    describe('createTask', () => {

        it('Should create a new task and add it to the tasks array', () => {
            const title = "Test Task"
            const task = taskService.createTask(title)
            expect(task).toBeDefined()
            expect(task.title).toBe(title)
            expect(task.completed).toBe(false)
            expect(taskService.getAllTasks()).toContain(task)
        })
    })

    describe('getAllTasks', () => {
        it('should return all tasks', () => {
            const task1 = taskService.createTask("Task 1")
            const task2 = taskService.createTask("Task 2")

            expect(taskService.getAllTasks()).toEqual([task1, task2])
        })
    })


    describe('getTaskById', () => {

        it('should return the task with the given id', () => {
            const task = taskService.createTask("Task")
            expect(taskService.getTaskById(task.id)).toBe(task)
        })

        it('should throw an error if the task does not exist', () => {
            expect(() => {
                taskService.getTaskById(999)

            }).toThrow('Task not found')
        })

    })

    describe('updateTask', () => {
        it('should update the task correctly', () => {
            const task = taskService.createTask('Task')
            const updatedTask = taskService.updateTask(task.id, { title: 'Updated task', completed: true })
            expect(updatedTask.completed).toBe(true)
            expect(updatedTask.title).toBe('Updated task')
        })

        it('should throw an error if the task does not exist', () => {
            expect(() => {
                taskService.updateTask(999, { title: 'Updated task', completed: true })
            }).toThrow('Task not found')
        })
    })

    describe('deleteTask', () => {
        it('should delete the task correctly', () => {
            const task = taskService.createTask('Task')
            expect(taskService.getAllTasks()).toContain(task)

            taskService.deleteTask(task.id)
            expect(taskService.getAllTasks()).not.toContain(task)
        })

        it('should throw an error if the task does not exist', () => {
            expect(() => {
                expect(taskService.deleteTask(999))
            }).toThrow('Task not found')
        })
    })

})