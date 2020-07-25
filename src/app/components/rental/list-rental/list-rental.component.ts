import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from "@angular/material"; // Esto es para el Material Dialog (Modal)
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';

import { RentalService } from 'src/app/services/rentals.service';
import { IRentals } from 'src/app/model/rentals';
import { AddRentalComponent } from '../add-rental/add-rental.component';

@Component({
  selector: 'app-list-rental',
  templateUrl: './list-rental.component.html',
  styleUrls: ['./list-rental.component.css']
})
export class ListRentalComponent implements OnInit {

  constructor(
    public service: RentalService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private confirmDialog: ConfirmDialogService
  ) {}
  
  @Input() movieId: number;
  rentals: IRentals[];
  rentalFilters: string;
  displayedColumns: string[] = ["Customer", "Rental Date", "Returned Date", "Status", "actions"];
  dataSource: MatTableDataSource<IRentals>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  disableBtn: boolean;

  ngOnInit() {
    this.service.getRentalsByMovie(this.movieId).subscribe({
      next: rentals => {
        this.rentals = rentals;
        this.dataSource = new MatTableDataSource<IRentals>(this.rentals);    
        // Con esto especifico que columnas quiero usar para el filter
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.Customer.toLowerCase().includes(filter);
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

  returnMovie(rental: IRentals){
    this.confirmDialog
    .openConfirmDialog("Are you sure you want to return this movie?")
    .afterClosed()
    .subscribe(res => {
      if (res) {
        this.service.delete(rental.ID).subscribe({
          next: rental => {
            /** Para refrescar la pantalla y no ver el elemento eliminado pude haber solo llamado a this.ngOnInit(); */
            this.ngOnInit();
            this.toastr.success("The movie has been returned successfully", "Movie Rental");
          },
          error: err => console.log("Error: " + err)          
        });
      }
    });
  }

  rent(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.movieId;
    this.dialog.open(AddRentalComponent, dialogConfig)
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
    });
  }
}
