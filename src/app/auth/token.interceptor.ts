import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(public authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.getJwtToken()) {
            request = this.addToken(request, this.authService.getJwtToken());
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Si el error es 401, intenta manejarlo con handle401Error
                    return this.handle401Error(request, next);
                }
                // Propaga otros errores
                return throwError(() => error);
            })
        );
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.jwt);
                    return next.handle(this.addToken(request, token.jwt));
                }),
                catchError((err) => {
                    this.isRefreshing = false;
                    this.authService.logout(); // Cierra sesión si el refresh falla
                    return throwError(() => err);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => next.handle(this.addToken(request, jwt)))
            );
        }
    }
}