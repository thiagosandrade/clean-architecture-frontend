import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserResponse } from '../models/user-response.model';
import { RegisterUserRequest } from '../models/register-user-request';
import { UpdateUserRequest } from '../models/update-user-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<UserResponse[]>(this.base);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.base}/${id}`);
  }

  register(request: RegisterUserRequest): Observable<void> {
    return this.http.post<void>(
        `${environment.apiUrl}/users/register`,
        request
    );
  }

  updateUser(id: string,  request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/users/${id}`,
      request
    );
}
  
}
