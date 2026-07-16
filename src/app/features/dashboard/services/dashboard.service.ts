import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/dashboard`;
  

  getDashboard(): Observable<DashboardResponse> {
    const userId = localStorage.getItem('id') ?? '';

    return this.http.get<DashboardResponse>(this.base, {
      params: {
        userId,
      },
    });
  }
}
