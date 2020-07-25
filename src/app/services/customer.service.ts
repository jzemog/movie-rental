import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from "rxjs/operators";

import { ICustomer } from "../model/customer";
import { ApiServer } from "../model/api-server";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMovie } from '../model/movie';

@Injectable({
  providedIn: "root"
})
export class CustomerService {

  constructor(private http: HttpClient) {}

  readonly domain = ApiServer;
  customer = {} as ICustomer;
  customers: ICustomer[]; /** Esto es necesatio solo para Ej:2, Ej:3 y EJ:4 de los Get  */
  form: FormGroup = new FormGroup({
    ID: new FormControl(null),
    FirstName: new FormControl("", Validators.required),
    LastName: new FormControl("", Validators.required),
    Email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
    IdentityCard: new FormControl(""),
    UniqueKey: new FormControl(""),
    Mobile: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    DateOfBirth: new FormControl("", Validators.required),
    RegistrationDate: new FormControl(""),
  });

  resetFormGroup() {
    this.form.setValue({
      ID: null,
      FirstName: "",
      LastName: "",
      Email: "",
      IdentityCard: "",
      UniqueKey: "",
      Mobile: "",
      DateOfBirth: "",
      RegistrationDate: ""
    });
  }  

  /** Agui hay 4 formas de hacer el Get */

  /** EJ:1 */
  // getCustomers() {
  //   return this.http
  //     .get(`${this.domain}/api/customers/all`)
  //     .pipe(map(res => res));
  // }

  /** EJ:2 */
  // /** Using Promises */
  // getCustomers() {
  //   return this.http
  //     .get(`${this.domain}/api/customers/all`)
  //     .toPromise()
  //     .then(res => (this.customers = res as Customer[]));
  // }

  /** EJ:3 */
  /** Using Async / Await */
  // async getCustomers() {
  //   const res = await this.http
  //     .get(`${this.domain}/api/customers/all`)
  //     .toPromise();
  //   return (this.customers = res as ICustomer[]);
  // }

  /** EJ:4 using Observables */
  getCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(`${this.domain}/api/customers/all`).pipe(
      //tap(data => console.log("Customers: " + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  async getCustomer(id: number) {
    const res = await this.http
      .get(`${this.domain}/api/customers/details/` + id)
      .toPromise();
    return (this.customer = res as ICustomer);
  }

  create(customer: ICustomer) {
    delete customer.ID;
    delete customer.UniqueKey;
    delete customer.RegistrationDate;
    return this.http.post(`${this.domain}/api/customers/add`, customer);
  }

  update(customer: ICustomer) {
    return this.http.post(`${this.domain}/api/customers/update`, customer);
  }

  delete(id: number) {
    return this.http.delete(`${this.domain}/api/customers/remove/` + id);
  }  

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = "";
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
