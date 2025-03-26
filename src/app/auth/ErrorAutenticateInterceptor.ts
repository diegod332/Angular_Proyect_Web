import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AppService} from '../../app/app.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorAutenticateInterceptor implements HttpInterceptor {

    constructor(private route: Router,
                private _globalService: AppService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: any) => {
                if (error.status == 401) {
                    this._globalService.showAlert.next({
                        msj: `Por seguridad la sesión ha expirado, lo redirigiremos al inicio de sesión.`,
                        type: 'danger'
                    });
                    this.removeTokens();
                    setTimeout(()=>{
                        this.route.navigate(['/']);
                    },8000);
                }
                return throwError(error);
            })
        );
    }

    public removeTokens() {
        localStorage.clear();
    }
}
