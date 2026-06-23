import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LoginRequest, AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.base}/login`, data);
  }

  register(data: LoginRequest) {
    return this.http.post(`${this.base}/register`, data);
  }

  saveUserInfo(token: string, id: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('id', id);
    localStorage.setItem('email', email);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}
