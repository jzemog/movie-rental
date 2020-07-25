import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CustomerService } from 'src/app/services/customer.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  constructor(
    public service: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<AddCustomerComponent>
  ) { }

  ngOnInit() {
  }

  addCustomer() {
    if (this.service.form.valid) {
      this.service.create(this.service.form.value).subscribe(res => {
        this.toastr.success("Customer inserted successfully", "Movie Rental");
        this.refreshScreen();
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

  refreshScreen() {
    this.resetForm();
    /** esto lo comente porke me hacia que la pantalla blinking cuando cerraba el material dialog 
      * entonces lo ke hago es llamar al ngOnInit del la view listar y asi evito el blinking */
    // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //   this.router.navigate(["/customers"]);
    // });
  }

  // found this online, approach to clear the modal, since doing this.service.resetFormGroup() was no working with cleaning the validations
  resetForm(){
    this.service.resetFormGroup();
    this.service.form.markAsPristine();
    this.service.form.markAsUntouched();
  }
}
