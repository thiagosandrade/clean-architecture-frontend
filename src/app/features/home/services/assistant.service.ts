import { Injectable } from "@angular/core";
import { TodoService } from "../../todos/services/todo.service";

@Injectable({
    providedIn: 'root'
})
export class AssistantService {

    constructor(private todoService: TodoService) { }

    getTasksForToday() {

        return this.todoService.searchTodos(
            '',
            1,
            20,
            'dueDate',
            false
        );

    }

}