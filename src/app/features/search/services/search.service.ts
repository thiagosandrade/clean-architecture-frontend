import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { QuickSearchResponse } from '../models/quick-search-response';
import { SearchResponse } from '../models/search-response';
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

  search(
    text: string,
    page = 1,
    pageSize = 25
  ): Observable<SearchResponse> {

    return this.http.post<SearchResponse>(
      `${this.api}/search`,
      {
        userId: localStorage.getItem('id') ?? '',
        text,
        page,
        pageSize
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