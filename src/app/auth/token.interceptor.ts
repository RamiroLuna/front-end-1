import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `${this.auth.getToken()}`,
                // 'Content-Type':'application/x-www-form-urlencoded'
            }
        });
        return next.handle(request);
    }
}