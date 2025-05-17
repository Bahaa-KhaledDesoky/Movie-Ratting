import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const accessToken = authService.getToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
      
          return http.get(`http://localhost:8081/api/auth/access/${refreshToken}`, { responseType: 'text' }).pipe(
            switchMap((newAccessToken: string) => {
              authService.saveToken(newAccessToken);
              
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });
              
              return next(retryReq).pipe(
                catchError(retryError => {
                  if (retryError.status === 401) {
                    authService.logout();
                  }
                  return throwError(() => retryError);
                })
              );
            }),
            catchError(refreshError => {
              
              if (refreshError.status === 401) {
                authService.logout();
              }
              return throwError(() => refreshError);
            })
          );
        } else {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
}; 