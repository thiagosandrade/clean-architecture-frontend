import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

import { routes } from './app.routes';

export const appConfig = {

  providers: [

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        errorInterceptor,
        loadingInterceptor
      ])
    ),

    provideNativeDateAdapter()

  ],

};