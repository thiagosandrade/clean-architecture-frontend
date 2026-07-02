import { Injectable } from "@angular/core";
import { TodoService } from "../../todos/services/todo.service";
import { Priority } from "../../../core/enums/priority.enum";

@Injectable({
    providedIn: 'root'
})
export class AssistantService {

    private readonly page = 1;
    private readonly size = 20;

    constructor(
        private todoService: TodoService
    ) { }

    private getToday(): string {

        return new Date()
            .toISOString()
            .split('T')[0];

    }

    private getTomorrow(): string {

        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        return tomorrow
            .toISOString()
            .split('T')[0];

    }
    
    private getThisWeek(): { start: string; end: string } {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return {
            start: startOfWeek.toISOString().split('T')[0],
            end: endOfWeek.toISOString().split('T')[0]
        };

    }

    getTasksForToday() {

        return this.todoService.getAll(
            this.page,
            this.size,
            'dueDate',
            false,
            undefined,
            this.getToday(),
            this.getTomorrow(),
            false
        );

    }

    getTasksForThisWeek() {

        return this.todoService.getAll(
            this.page,
            this.size,
            'dueDate',
            false,
            undefined,
            this.getThisWeek().start,
            this.getThisWeek().end,
            false
        );

    }

    getHighPriorityTasks() {

        return this.todoService.getAll(
            this.page,
            this.size,
            'priority',
            true,
            Priority.High,
            undefined,
            undefined,
            false
        );

    }

    getNextWorkTasks() {

        return this.todoService.getAll(
            this.page,
            this.size,
            'dueDate',
            false,
            undefined,
            undefined,
            undefined,
            false
        );

    }

    getOverdueTasks() {

        return this.todoService.getAll(
            this.page,
            this.size,
            'dueDate',
            false,
            undefined,
            undefined,
            this.getToday(),
            false
        );

    }

}