import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    title: 'Task App - Login',
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    title: 'Task App - Register',
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    title: 'Task App - Home',
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    title: 'Task App - User',
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/components/user/user.component').then((m) => m.UserComponent),
  },
  {
    title: 'Task App - Users',
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/components/users/users.component').then((m) => m.UsersComponent),
  },
  {
    title: 'Task App - Todos',
    path: 'todos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/todo/components/todos/todos.component').then((m) => m.TodosComponent),
  },
  {
    title: 'Task App',
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    title: 'Task App',
    path: '**',
    redirectTo: 'login'
  }
];
