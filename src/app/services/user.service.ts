import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { map } from "rxjs/operators";
import { IUser } from "../model/user";
import { ApiServer } from "../model/api-server";
import { FormGroup, FormControl, Validators } from '@angular/forms';

// import {
//   FormGroup,
//   FormControl,
//   Validator,
//   Validators
// } from "@angular/forms"; /** OJO: Esto es usando Reactive forms approach */

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}
  
  readonly domain = ApiServer;
  user = {} as IUser;
  form: FormGroup = new FormGroup({
    UserName: new FormControl(""),
    Password: new FormControl("", [Validators.required]),
    Email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
  });

  resetFormGroup() {
    this.form.setValue({
      UserName: "",
      Password: "",
      Email: ""
    });
  }

  /** Con { observe: "response" } controlo lo que viene el la response como tal, sin convertirla a JSON
   *  asi puedo saber el status de la response, por ejemplo. Esto me sirve pa si la web api action method
   * solo retorna algo como return OK(); asi podre obtener el status de la response y saber ke notificacion
   * mostrarle al user por ejemplo, 200 - OK, 400 - Bad request, etc
   */
  register(user: IUser) {
    return this.http
      .post(`${this.domain}/api/account/register`, user, {
        observe: "response"
      })
      .pipe(map(res => res));
  }
  /** Con esta function manejo el login, como estoy haciendo la authentication con token estonces lo ke se hace
   * es llamar a /token pasandole las credential con las que se registro el ususario y una vez generado ese token
   * se le pasa a todas las llamadas ke se hagan y este es el que valida al user.
   */
  authentication(user: IUser) {
    var data =
      "username=" +
      user.Email +
      "&password=" +
      user.Password +
      "&grant_type=password";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-urlencoded",
      "No-Auth": "true"
    });
    return this.http
      .post(`${this.domain}/token`, data, { headers: reqHeader })
      .pipe(map(res => res));
  }

  logout(): void {    
    localStorage.removeItem("userToken");

  }

  isLoggedIn(): boolean {
    if (localStorage.getItem("userToken")) {
      return true;
    }
    return false;
  }

  // /** OJO: Esto es un ejemplo usando Reactive form approach */
  // constructor() {}

  // form: FormGroup = new FormGroup({
  //   $key: new FormControl(null),
  //   username: new FormControl("", Validators.required),
  //   email: new FormControl("", [Validators.required, Validators.email]),
  //   password: new FormControl("", Validators.required),
  //   confirmpassword: new FormControl("", Validators.required)
  // });
}
