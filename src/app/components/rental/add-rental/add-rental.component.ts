import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { RentalService } from 'src/app/services/rentals.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ICustomer } from 'src/app/model/customer';
import { StockService } from 'src/app/services/stock.service';
import { MovieService } from 'src/app/services/movie.service';
import { IStock } from 'src/app/model/stock';

@Component({
  selector: 'app-add-rental',
  templateUrl: './add-rental.component.html',
  styleUrls: ['./add-rental.component.css']
})
export class AddRentalComponent implements OnInit {

  stocks: IStock[];
  customers: ICustomer[];
  name: string;

  constructor(    
    public service: RentalService,
    public movieService: MovieService,
    public stockService: StockService,
    public customerService: CustomerService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddRentalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit() {
    this.stockService.getStocksByMovie(this.data).subscribe({
      next: stocks => {
        this.stocks = stocks.filter(elem => elem.IsAvailable === true);   
      },
      error: err => console.log("Error: " + err)
    });
    this.customerService.getCustomers().subscribe({
      next: customers => {
        this.customers = customers;   
      },
      error: err => console.log("Error: " + err)
    });
    this.movieService.getMovie(this.data).then((res) => {
      this.name = res.Title;
    })
  }

  addRental() {
    if (this.service.form.valid) {
      this.service.create(this.service.form.value).subscribe(res => {
        this.toastr.success("The movie has been rented successfully", "Movie Rental");
        this.resetForm();
        this.onClose();
      });
    } else {
      console.log("something wrong");
    }
  }

  onClose() {
    this.resetForm();
    this.dialogRef.close();
  }

  // found this online, approach to clear the modal, since doing just this.service.resetFormGroup() was no working with cleaning the validations
  resetForm(){
    this.service.resetFormGroup()
    this.service.form.markAsPristine();
    this.service.form.markAsUntouched();
  }
}
