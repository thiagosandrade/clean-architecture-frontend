import { Routes } from '@angular/router';

export const todoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/todos/todos.component').then((m) => m.TodosComponent),
  },
  {
    path: 'task/:id',
    loadComponent: () =>
      import('./components/task-workspace/task-workspace').then((m) => m.TaskWorkspaceComponent),
  },
];
