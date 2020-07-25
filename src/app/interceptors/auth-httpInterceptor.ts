import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

/** Esta clase se va a encargar de controlar el token en las llamadas, aki definimos que va a hacer nuestra
 * applicacion en los distintos escenarios del token, cuando este vigente, cuando expire, si la llamada no
 * requiere token, etc. Como se hace la especificidad para "No-Auth" entonces solo tengo ke pasarle el
 * Authorization header a las llamadas que no van a requerir token, como Register y token, por ejemplo,
 * a las ke si ya se encargara este Interceptor de pasarle ese header.
 */
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.headers.get("No-Auth") == "true") {
      return next.handle(request.clone());
    }

    if (localStorage.getItem("userToken") != null) {
      const clonedreq = request.clone({
        headers: request.headers.set(
          "Authorization",
          "Bearer " + localStorage.getItem("userToken")
        )
      });
      return next.handle(clonedreq).pipe(
        tap(
          success => {},
          error => {
            /* logging the http response to browser's console in case of a failuer */
            if (event instanceof HttpResponse) {
              console.log("api call error :", event);
            }
            if (error.status === 401) this.router.navigateByUrl("/");
          }
        )
      );
    } else {
      this.router.navigateByUrl("/");
    }
  }
}
