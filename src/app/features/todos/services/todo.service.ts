import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {

  private base = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getAll() {
    let userId = localStorage.getItem('id');
    return this.http.get<Todo[]>(`${this.base}?userId=${userId}`);
  }

  create(title: string) {
    return this.http.post<Todo>(this.base, { title });
  }

  complete(id: number) {
    return this.http.put<void>(`${this.base}/${id}/complete`, {});
  }

  reset(id: number) {
    return this.http.put<void>(`${this.base}/${id}/reset`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}