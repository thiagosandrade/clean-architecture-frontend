import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UpdateTodoRequest } from '../models/update-todo-request.model';
import { CreateTodoRequest } from '../models/create-todo-request.model';
import { TaskItem, TodoResponse } from '../models/todo.model';
import { ParsedTodo } from '../models/parsed-todo-response.model';
import { environment } from '../../../../environments/environment';
import { RewriteStyle } from '../../../core/enums/rewrite-style.enum';
import { SubtaskRewriteResponse } from '../models/subtask-rewrite-response.model';
import { BreakdownComplexity, BreakdownStrategy } from '../../../core/enums/todo-breakdown-options.enum';
import { BreakdownResponse } from '../models/breakdown-response.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private base = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1,
    size: number = 10,
    propertyName: string = 'createdAt',
    descending: boolean = true,
    priority?: number,
    dueDateFrom?: string,
    dueDateTo?: string,
    isCompleted?: boolean,
  ) {
    const userId = localStorage.getItem('id');

    let params = new HttpParams()
      .set('userId', userId ?? '')
      .set('page', page)
      .set('size', size)
      .set('propertyName', propertyName)
      .set('descending', descending);

    if (priority !== undefined) {
      params = params.set('priority', priority);
    }

    if (dueDateFrom !== undefined) {
      params = params.set('dueDateFrom', dueDateFrom);
    }

    if (dueDateTo !== undefined) {
      params = params.set('dueDateTo', dueDateTo);
    }

    if (isCompleted !== undefined) {
      params = params.set('isCompleted', isCompleted);
    }

    return this.http.get<TodoResponse>(this.base, { params });
  }

  searchTodos(
    searchText: string,
    page: number,
    size: number,
    propertyName?: string,
    descending?: boolean,
  ) {
    const userId = localStorage.getItem('id') ?? '';

    const params: any = {
      userId,
      searchText,
      page,
      size,
    };

    if (propertyName) {
      params.propertyName = propertyName;
    }

    if (descending !== undefined) {
      params.descending = descending;
    }

    return this.http.get<TodoResponse>(`${this.base}/search`, { params });
  }

  create(request: CreateTodoRequest) {
    request.userId = localStorage.getItem('id') ?? '';
    return this.http.post(this.base, request);
  }

  complete(id: string) {
    return this.http.put<void>(`${this.base}/${id}/complete`, {});
  }

  reset(id: string) {
    return this.http.put<void>(`${this.base}/${id}/reset`, {});
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  update(id: string, request: UpdateTodoRequest) {
    request.userId = localStorage.getItem('id') ?? '';
    return this.http.put(`${this.base}/${id}`, request);
  }

  parseTodo(description: string) {
    return this.http.post<ParsedTodo>(`${this.base}/parse`, {
      userId: localStorage.getItem('id') ?? '',
      description,
    });
  }

  breakdown(id: string, options: { complexity: BreakdownComplexity; strategy: BreakdownStrategy; }) {
    return this.http.put<BreakdownResponse>(
      `${this.base}/ai/${id}/breakdown`,
      {
        userId:
          localStorage.getItem('id') ?? '',

        ...options
      }
    );
  }

  rewrite(id: string, request: { userId: string; description: string; style: RewriteStyle; }) {
    return this.http.put<SubtaskRewriteResponse>(
      `${environment.apiUrl}/todos/ai/${id}/rewrite`,
      request
    );
  }
  getById(id: string) {
    return this.http.get<TaskItem>(`${this.base}/${id}`);
  }

  saveSubItems(id: string, subItems: TaskItem['subtasks']) {
    return this.http.put(`${this.base}/${id}/subitems`, {
      userId: localStorage.getItem('id') ?? '',
      todoSubItems: subItems,
    });
  }
}
