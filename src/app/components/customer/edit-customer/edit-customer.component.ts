import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomer } from 'src/app/model/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { RentalService } from 'src/app/services/rentals.service';
import { IRentals } from 'src/app/model/rentals';
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  rentals: IRentals[];

  constructor(
    public service: CustomerService,
    private rentalService: RentalService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<EditCustomerComponent>,
    private formBuilder: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ICustomer
  ) { }

  ngOnInit() {
    // this.service.form = this.formBuilder.group({
    //   ID: this.data.ID,
    //   FirstName: this.data.FirstName,
    //   LastName: this.data.LastName,
    //   Email: this.data.Email,
    //   IdentityCard: this.data.IdentityCard,
    //   UniqueKey: this.data.UniqueKey,
    //   Mobile: this.data.Mobile,
    //   DateOfBirth: this.data.DateOfBirth,
    //   RegistrationDate: this.data.RegistrationDate
    // });
    /** Usando FormGroup y no formBuilder es como unico consigo que funcione la validation en este MatDialog */
    this.service.form = new FormGroup({
      ID: new FormControl(this.data.ID),
      FirstName: new FormControl(this.data.FirstName, Validators.required),
      LastName: new FormControl(this.data.LastName, Validators.required),
      Email: new FormControl(this.data.Email, [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
      IdentityCard: new FormControl(this.data.IdentityCard),
      UniqueKey: new FormControl(this.data.UniqueKey),
      Mobile: new FormControl(this.data.Mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      DateOfBirth: new FormControl(this.data.DateOfBirth, Validators.required),
      RegistrationDate: new FormControl(this.data.RegistrationDate),
    });
  }

  editCustomer(): void {
    if (this.service.form.valid) {
      this.service.update(this.service.form.value).subscribe(res => {
        this.toastr.success("Customer updated successfully", "Movie Rental");
        this.refreshScreen();
        this.onClose();
      });
    } else {
      console.log("something wrong");
    }
  }

  refreshScreen(): void {
    this.resetForm();
    /** esto lo comente porke me hacia que la pantalla blinking cuando cerraba el material dialog 
      * entonces lo ke hago es llamar al ngOnInit del la view listar y asi evito el blinking */
    // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //   this.router.navigate(["/customers"]);
    // });
  }

  onClose(): void {    
    this.resetForm();
    this.dialogRef.close();
  }

  deleteCustomer(): void {
    // Chequear si tiene alguna pelicula rentada
    const id = this.service.form.value.ID;
    this.rentalService.getRentalsByCustomer(id).subscribe({
      next: rentals => {
        this.rentals = rentals;
        let moviesBorrowed = this.rentals.find(elem => {
          return elem.Status === "Borrowed";          
        });
        if(moviesBorrowed === undefined) {          
          this.delete(id);
        } else {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.data = {
            message: "The Customer has movies borrowed, so it cannot be deleted."
          }
          this.dialog.open(MessageDialogComponent, dialogConfig);
        }        
      },
      error: err => console.log("Error: " + err)
    })   
  }

  delete(id: number): void {
    this.confirmDialog
      .openConfirmDialog("Are you sure you want to delete this Customer?")
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.service.delete(id).subscribe(res => {
            /** Para refrescar la pantalla y no ver el elemento eliminado pude haber solo llamado a this.ngOnInit(); */
            //this.ngOnInit();
            this.refreshScreen();            
            this.toastr.success("Customer deleted successfully", "Movie Rental");
            this.onClose();
          });
        }
      });
  }

  // found this online, approach to clear the modal, since doing just this.service.resetFormGroup() was no working with cleaning the validations
  resetForm(){
    this.service.resetFormGroup()
    this.service.form.markAsPristine();
    this.service.form.markAsUntouched();
  }
}
