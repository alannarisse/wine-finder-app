import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const api = environment.apiUrl.replace(/\/$/, '') + '/';
  if (!request.url.startsWith(api)) return next(request);
  const token = auth.token;
  const authenticated = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;
  return next(authenticated).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) auth.clear();
      return throwError(() => error);
    }),
  );
};
