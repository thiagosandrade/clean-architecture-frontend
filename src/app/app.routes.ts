import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    title: 'Task App - Auth',
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    title: 'Task App - Home',
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
  },
  {
    title: 'Task App - User',
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes').then((m) => m.userRoutes),
  },
  {
    title: 'Task App - Users',
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes').then((m) => m.userRoutes),
  },
  {
    title: 'Task App - Tasks',
    path: 'todos',
    canActivate: [authGuard],
    loadChildren: () => import('./features/todo/todo.routes').then((m) => m.todoRoutes),
  },
  {
    title: 'Task App - Dashboard',
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    title: 'Task App - Search Details',
    path: 'search',
    canActivate: [authGuard],
    loadChildren: () => import('./features/search/search.routes').then((m) => m.searchRoutes),
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
    redirectTo: 'login',
  },
];
