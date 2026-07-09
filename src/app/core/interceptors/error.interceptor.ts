import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snack = inject(SnackbarService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        auth.logout();

        router.navigate(['/login']);

        return throwError(() => err);
      }

      let message = 'Unexpected error occurred';

      if (err.error) {
        // ProblemDetails from ASP.NET
        message = err.error.detail ?? err.error.title ?? message;
      }

      snack.error(message);

      return throwError(() => err);
    }),
  );
};
