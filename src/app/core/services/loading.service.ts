import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = 0;

  private loadingSubject = new BehaviorSubject(false);

  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.activeRequests++;

    queueMicrotask(() => {
      this.loadingSubject.next(true);
    });
  }

  hide(): void {
    this.activeRequests--;

    if (this.activeRequests <= 0) {
      this.activeRequests = 0;

      queueMicrotask(() => {
        this.loadingSubject.next(false);
      });
    }
  }
}
