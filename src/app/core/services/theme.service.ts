import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = false;

  toggle() {
    this.dark = !this.dark;
    localStorage.setItem('dark', String(this.dark));
    document.body.classList.toggle('dark-theme', this.dark);
  }

  init() {
    const saved = localStorage.getItem('dark') === 'true';
    this.dark = saved;
    document.body.classList.toggle('dark-theme', saved);
  }
}
