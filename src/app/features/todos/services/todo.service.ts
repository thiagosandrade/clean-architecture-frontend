import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {

  private base = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getAll(
  page: number = 1,
  size: number = 10,
  propertyName: string = 'createdAt',
  descending: boolean = true
) {

  const userId = localStorage.getItem('id');

  const params = new HttpParams()
    .set('userId', userId ?? '')
    .set('page', page)
    .set('size', size)
    .set('propertyName', propertyName)
    .set('descending', descending);

  return this.http.get<any>(
    this.base,
    { params }
  );
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