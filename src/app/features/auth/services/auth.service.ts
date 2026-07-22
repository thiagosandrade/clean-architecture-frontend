import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import {
  AuthResponse,
  LoginRequest
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly base =
    `${environment.apiUrl}/users`;

  private readonly _token =
    signal(localStorage.getItem('token'));

  private readonly _userId =
    signal(localStorage.getItem('id'));

  private readonly _email =
    signal(localStorage.getItem('email'));

  readonly isAuthenticated =
    computed(() => !!this._token());

  readonly token =
    this._token.asReadonly();

  readonly userId =
    this._userId.asReadonly();

  readonly email =
    this._email.asReadonly();

  constructor(
    private readonly http: HttpClient
  ) { }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(
      `${this.base}/login`,
      request
    );
  }

  register(request: LoginRequest) {
    return this.http.post(
      `${this.base}/register`,
      request
    );
  }

  saveUserInfo(
    token: string,
    id: string,
    email: string
  ): void {

    localStorage.setItem('token', token);
    localStorage.setItem('id', id);
    localStorage.setItem('email', email);

    this._token.set(token);
    this._userId.set(id);
    this._email.set(email);

  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('email');

    this._token.set(null);
    this._userId.set(null);
    this._email.set(null);

  }

}