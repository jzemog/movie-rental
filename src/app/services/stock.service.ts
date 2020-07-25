import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiServer } from "../model/api-server";
import { Observable, throwError } from 'rxjs';

import { IStock } from '../model/stock';

@Injectable({
  providedIn: "root"
})
export class StockService {

  constructor(private http: HttpClient) {}

  readonly domain = ApiServer;
  stock = {} as IStock;
  stocks: IStock[]; /** Esto es necesatio solo para Ej:2 y Ej:3 de los Get  */
  form: FormGroup = new FormGroup({
    ID: new FormControl(null),
    MovieId: new FormControl(""),
    UniqueKey: new FormControl(""),
    IsAvailable: new FormControl(""),
  });

  resetFormGroup() {
    this.form.setValue({
      ID: null,
      MovieId: "",
      UniqueKey: "",
      IsAvailable: "",
    });
  }

  getStocks(): Observable<IStock[]> {
    return this.http.get<IStock[]>(`${this.domain}/api/stocks/all`).pipe(
      catchError(this.handleError)
    );
  }

  getStocksByMovie(id: number): Observable<IStock[]> {
    return this.http.get<IStock[]>(`${this.domain}/api/stocks/movie/` + id).pipe(
      //tap(data => console.log("Stocks: " + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  async getStock(id: Number) {
    const res = await this.http
      .get(`${this.domain}/api/stocks/details/` + id)
      .toPromise();
    return (this.stock = res as IStock);
  }

  create(stock: IStock): Observable<IStock> {
    delete stock.ID;
    return this.http.post<IStock>(`${this.domain}/api/stocks/add`, stock).pipe(
      catchError(this.handleError)
    );
  }

  update(stock: IStock): Observable<IStock> {
    return this.http.post<IStock>(`${this.domain}/api/stocks/update`, stock).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.domain}/api/stocks/remove/` + id);
  }

  getRentalsByCustomer(id: number): Observable<IStock[]> {
    return this.http.get<IStock[]>(`${this.domain}/api/stocks/customer/` + id).pipe(
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
