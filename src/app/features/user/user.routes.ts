import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/user/user.component').then((m) => m.UserComponent),
  }
];
