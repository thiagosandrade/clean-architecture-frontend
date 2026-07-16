import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/user/user.component').then((m) => m.UserComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/users/users.component').then((m) => m.UsersComponent),
  },
];
