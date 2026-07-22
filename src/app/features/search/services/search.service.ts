import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { QuickSearchResponse } from '../models/quick-search-response';
import { SearchDetailResponse } from '../models/search-detail.model';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly http =
    inject(HttpClient);

  private readonly api =
    environment.apiUrl;

  quickSearch(
    text: string,
    limit = 5
  ): Observable<QuickSearchResponse> {

    const userId = localStorage.getItem('id') ?? '';

    return this.http.post<QuickSearchResponse>(
      `${this.api}/search/quick`,
      {
        userId: userId,
        text,
        limit
      }
    );

  }

  getDetail(
    type: string,
    id: string
  ): Observable<SearchDetailResponse> {
    return this.http.post<SearchDetailResponse>(
      `${this.api}/search/details/${type}/${id}`,
      {
        userId: localStorage.getItem('id') ?? '',
      }
    );
  }

}