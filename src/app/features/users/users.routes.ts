import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/users-list/users-list.component').then((m) => m.UsersListComponent),
  },
];
