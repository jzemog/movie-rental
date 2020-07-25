import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatDialog, MatDialogConfig } from "@angular/material"; // Esto es para el Material Dialog (Modal)
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';

import { ICustomer } from "src/app/model/customer";
import { CustomerService } from "src/app/services/customer.service";

@Component({
  selector: "app-list-customer",
  templateUrl: "./list-customer.component.html",
  styleUrls: ["./list-customer.component.css"]
})
export class ListCustomerComponent implements OnInit {
  constructor(
    public service: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private confirmDialog: ConfirmDialogService
  ) {}
  
  customers: ICustomer[];
  customerFilters: string;
  closeResult: string;
  displayedColumns: string[] = ["FirstName", "LastName", "Email", "DateOfBirth", "RegistrationDate", "Mobile"];
  dataSource: MatTableDataSource<ICustomer>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  /** Asi defino el ngOnInit si uso el Ej:1 de customer.service.ts */
  // ngOnInit() {
  //   // this.service.getCustomers().subscribe((data: any) => {
  //   //   this.customers = data;
  //   // });
  // }

  /** Asi defino el ngOnInit si uso los Ej:2 y Ej:3 de customer.service.ts */
  // ngOnInit() {
  //   this.service.getCustomers().then(list => {
  //     let array = list.map(item => {
  //       return {
  //         $ID: item.ID,
  //         ...item.payload.val()
  //       }
  //     })
  //   });
  // }

  /** Asi defino el ngOnInit para el EJ:4 de customer.service.ts con Angular material pagination */
  ngOnInit() {
    this.service.getCustomers().subscribe({
      next: customers => {
        this.customers = customers;
        this.dataSource = new MatTableDataSource<ICustomer>(this.customers);    
        // Con esto especifico que columnas quiero usar para el filter
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.FirstName.toLowerCase().includes(filter) || data.LastName.toLowerCase().includes(filter);
        }; 
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.log("Error: " + err)
    })        
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();    
  }

  addCustomer() {
    const dialogConfig = new MatDialogConfig();
    // Evitar que se cierre la modal cuando se da un click fuera de ella.
    // esto tambies se logra con esto this.dialog.open(AddMovieComponent, { disableClose: true });
    dialogConfig.disableClose = true;
    // Hace que el primer elemento dentro de la modal coga el focus por defecto
    dialogConfig.autoFocus = true;
    // Hace que la modal ocupe el 60% de toda la window
    // dialogConfig.width = "60%";
    this.dialog.open(AddCustomerComponent, dialogConfig)
    .afterClosed()
    .subscribe({
      next: () => {
        /** Todo este bloque desde .afterClosed ... hasta el final evita el blincking que ocurria cuando cerraba
         *  el material dialog refrescando la route desde los dialogs add y edit. Llamando solo a ngOnInit es
         *  suficiente para refrescar la pantalla, ya que no necesito cambial la route porke estoy usando dialogs
         */
        this.ngOnInit();
      },
      error: err => console.log("Error: " + err)
    });;
  }

  editCustomer(customer: ICustomer): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = customer;
    this.dialog.open(EditCustomerComponent, dialogConfig)
    .afterClosed()
    .subscribe({
      next: () => {
        /** Todo este bloque desde .afterClosed ... hasta el final evita el blincking que ocurria cuando cerraba
         *  el material dialog refrescando la route desde los dialogs add y edit. Llamando solo a ngOnInit es
         *  suficiente para refrescar la pantalla, ya que no necesito cambial la route porke estoy usando dialogs
         */
        this.ngOnInit();
      },
      error: err => console.log("Error: " + err)
    });;
  }
}
