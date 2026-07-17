import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PermissionResponse } from '../models/permission-response.model';
import { RemoveUserPermissionRequest } from '../models/remove-user-permission-request.model';
import { SetUserPermissionRequest } from '../models/set-user-permission-request.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getPermissions(): Observable<PermissionResponse[]> {

    return this.http.get<PermissionResponse[]>(
      `${this.apiUrl}/permissions`
    );

  }

  setPermission(
    request: SetUserPermissionRequest
  ): Observable<void> {

    return this.http.post<void>(
      `${this.apiUrl}/user-permission/set`,
      request
    );

  }

  removePermission(
    request: RemoveUserPermissionRequest
  ): Observable<void> {

    return this.http.post<void>(
      `${this.apiUrl}/user-permission/remove`,
      request
    );

  }

}