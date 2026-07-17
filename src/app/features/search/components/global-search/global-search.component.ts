import {
  Component,
  HostListener,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  firstValueFrom
} from 'rxjs';

import {
  SearchService
} from '../../services/search.service';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';
import { QuickSearchResponse } from '../../models/quick-search-response';
import { SearchDetailLink, SearchDetailType } from '../../models/search-detail.model';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent {

  private readonly service =
    inject(SearchService);

  private readonly router =
    inject(Router);

  readonly search =
    new FormControl(
      '',
      { nonNullable: true }
    );

  readonly loading =
    signal(false);

  readonly opened =
    signal(false);

  readonly results =
    signal<QuickSearchResponse | null>(null);

  constructor() {

    this.search.valueChanges.pipe(

      debounceTime(300),

      distinctUntilChanged(),

      filter(x => x.trim().length >= 2)

    ).subscribe(value => {

      void this.performSearch(value);

    });

  }

  private async performSearch(
    text: string
  ): Promise<void> {

    this.loading.set(true);

    this.opened.set(true);

    try {

      const response =
        await firstValueFrom(

          this.service.quickSearch(text)

        );

      this.results.set(response);

    }
    finally {

      this.loading.set(false);

    }

  }

  clear(): void {

    this.search.setValue('');

    this.results.set(null);

    this.opened.set(false);

  }

  showAll(): void {

    const query =
      this.search.value.trim();

    if (!query) {
      return;
    }

    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          q: query
        }
      }
    );

    this.opened.set(false);

  }

  openDetail(
    type: SearchDetailType,
    id: string
  ): void {

    this.opened.set(false);

    this.router.navigate([
      '/search/detail',
      type,
      id
    ]);

  }

  @HostListener('document:click')
  close(): void {

    this.opened.set(false);

  }

  stop(
    event: MouseEvent
  ): void {

    event.stopPropagation();

  }

}