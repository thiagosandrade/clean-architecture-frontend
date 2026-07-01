import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    title: 'Todo App - Login',
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    title: 'Todo App - Register',
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    title: 'Todo App - Home',
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    title: 'Todo App - User',
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/user.component').then((m) => m.UserComponent),
  },
  {
    title: 'Todo App - Users',
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
  },
  {
    title: 'Todo App - Todos',
    path: 'todos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/todos/todos.component').then((m) => m.TodosComponent),
  },
  {
    title: 'Todo App',
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    title: 'Todo App',
    path: '**',
    redirectTo: 'login'
  }
];
