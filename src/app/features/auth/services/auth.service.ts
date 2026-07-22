import {
  Injectable,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../../../../environments/environment';

import {
  AuthResponse,
  LoginRequest
} from '../models/auth.models';

import {
  StorageService
} from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http =
    inject(HttpClient);

  private readonly storage =
    inject(StorageService);


  private readonly base =
    `${environment.apiUrl}/users`;


  private readonly _token =
    signal<string | null>(
      this.storage.getItem<string>('token')
    );


  private readonly _userId =
    signal<string | null>(
      this.storage.getItem<string>('id')
    );


  private readonly _email =
    signal<string | null>(
      this.storage.getItem<string>('email')
    );


  readonly token =
    this._token.asReadonly();


  readonly userId =
    this._userId.asReadonly();


  readonly email =
    this._email.asReadonly();


  readonly isAuthenticated =
    computed(
      () => !!this._token()
    );


  login(
    request: LoginRequest
  ) {

    return this.http.post<AuthResponse>(
      `${this.base}/login`,
      request
    );

  }


  register(
    request: LoginRequest
  ) {

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


    this.storage.setItem(
      'token',
      token
    );


    this.storage.setItem(
      'id',
      id
    );


    this.storage.setItem(
      'email',
      email
    );


    this._token.set(token);

    this._userId.set(id);

    this._email.set(email);

  }


  logout(): void {


    this.storage.removeItem(
      'token'
    );


    this.storage.removeItem(
      'id'
    );


    this.storage.removeItem(
      'email'
    );


    this._token.set(null);

    this._userId.set(null);

    this._email.set(null);

  }


}