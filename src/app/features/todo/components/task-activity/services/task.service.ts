import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ActivitiesResponse } from '../models/activities-response.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private base = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivities(
    taskId: string
  ) {
    const userId = localStorage.getItem('id');

     let params = new HttpParams()
      .set('userId', userId ?? '')

    return this.http.get<ActivitiesResponse>(`${this.base}/task/${taskId}`,{ params });
  }
}
