import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    /* aqui es donde especifico que quiero controlar con este Guard, en este caso quiero controlar que si el user no esta authenticado
    no se acceda a ninguna route, solo a la '/' (login) */
    if (this.userService.isLoggedIn()) {
      /* si esta logueado se accedera a la route */
      return true;
    } else {
      /* si no esta logueado se redirecciona a la route login */
      this.router.navigate(["/"]);
      return false;
    }
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
