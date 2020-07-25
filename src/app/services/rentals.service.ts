import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiServer } from "../model/api-server";
import { Observable, throwError } from 'rxjs';

import { IRentals } from '../model/rentals';

@Injectable({
  providedIn: "root"
})
export class RentalService {
  constructor(private http: HttpClient) {}

  readonly domain = ApiServer;
  rental = {} as IRentals;
  rentals: IRentals[]; /** Esto es necesatio solo para Ej:2 y Ej:3 de los Get  */
  form: FormGroup = new FormGroup({
    ID: new FormControl(null),
    CustomerId: new FormControl("", Validators.required),
    StockId: new FormControl("", Validators.required),
    RentalDate: new FormControl(""),
    ReturnedDate: new FormControl(""),
    Status: new FormControl(""),
  });

  resetFormGroup() {
    this.form.setValue({
      ID: null,
      CustomerId: "",
      StockId: "",
      RentalDate: "",
      ReturnedDate: "",
      Status: "",
    });
  }

  getRentals(): Observable<IRentals[]> {
    return this.http.get<IRentals[]>(`${this.domain}/api/rentals/all`).pipe(
      catchError(this.handleError)
    );
  }

  async getRental(id: Number) {
    const res = await this.http
      .get(`${this.domain}/api/rentals/details/` + id)
      .toPromise();
    return (this.rental = res as IRentals);
  }

  create(rental: IRentals): Observable<IRentals> {
    delete rental.ID;
    delete rental.RentalDate;
    rental.Status = "Borrowed";
    //console.log(rental);
    return this.http.post<IRentals>(`${this.domain}/api/rentals/add`, rental).pipe(
      catchError(this.handleError)
    );
  }

  update(rental: IRentals): Observable<IRentals> {
    return this.http.post<IRentals>(`${this.domain}/api/rentals/update`, rental).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<IRentals> {
    return this.http.delete<IRentals>(`${this.domain}/api/rentals/remove/` + id).pipe(
      catchError(this.handleError)
    );
  }

  getRentalsByCustomer(id: number): Observable<IRentals[]> {
    return this.http.get<IRentals[]>(`${this.domain}/api/rentals/customer/` + id).pipe(
      catchError(this.handleError)
    );
  }

  getRentalsByMovie(id: number): Observable<IRentals[]> {
    return this.http.get<IRentals[]>(`${this.domain}/api/rentals/movie/` + id).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
