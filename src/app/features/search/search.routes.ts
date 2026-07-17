import { Routes } from '@angular/router';

export const searchRoutes: Routes = [
  {
    path: 'detail/:type/:id',
    loadComponent: () => import('./components/search-detail/search-detail').then(m => m.SearchDetailComponent)
  }
];
