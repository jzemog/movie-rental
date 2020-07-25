import { Component, OnInit } from "@angular/core";
import { IMovie } from "src/app/model/movie";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MovieService } from "src/app/services/movie.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatDialogConfig } from "@angular/material"; // Esto es para el Material Dialog (Modal)
import { AddMovieComponent } from "../add-movie/add-movie.component";
import { ConfirmDialogService } from "src/app/services/confirm-dialog.service";
import { EditMovieComponent } from "../edit-movie/edit-movie.component";
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';
import { RentalService } from 'src/app/services/rentals.service';
import { IRentals } from 'src/app/model/rentals';
import { AddRentalComponent } from '../../rental/add-rental/add-rental.component';

@Component({
  selector: "app-list-movie",
  templateUrl: "./list-movie.component.html",
  styleUrls: ["./list-movie.component.css"]
})
export class ListMovieComponent implements OnInit {
  constructor(
    public service: MovieService,
    private rentalService: RentalService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private confirmDialog: ConfirmDialogService
  ) {}

  movies: IMovie[] = [];
  movieFilters: string;
  closeResult: string;
  image: any;
  rentals: IRentals[];

  ngOnInit() {
    this.service.getMovies().subscribe((data: IMovie[]) => {
      data.forEach((movie: any) => {
        // esto es lo que tengo que hacer cuando el field esta base64 encoded como este caso que es la imagen
        // usando sanitizer le digo al browser que la url es safe y puede confiar en ella, o sea que se puede usar el links, etc
        movie.ImageUrl = this.sanitizer.bypassSecurityTrustUrl(movie.ImageUrl);
      });
      this.movies = data;
    });
  }

  // editMovie(movie: Movie) {
  //   this.router.navigate(["/movie-edit", movie.ID]);
  // }

  deleteMovie(movie: IMovie) {
    // Chequeo si alguno de los stocks de esta pelicula esta rentada
    const id = movie.ID;
    this.rentalService.getRentalsByMovie(id).subscribe({
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
            message: "This movie has stock borrowed, so it cannot be deleted."
          }
          this.dialog.open(MessageDialogComponent, dialogConfig);
        }        
      },
      error: err => console.log("Error: " + err)
    })     
  }

  delete(id: number): void {
    /** Aqui voy a usar la Material Modal
     * 
      MatDialogConfig: me permite configurar la modal, esto tiene varias formas de hacerlo 
      (ver fn addMovie, aqui y el service confirm-dialog.services, en la carpeta services)
      
      Con ".afterClosed()" es que manejo si dio click en Yes o en No, para esto donde defino 
      el markup de la modal (confirm-dialog.component.html en este caso) debo usar esta directive 
      [mat-dialog-close]="false" en el btn NO y 
      [mat-dialog-close]="true" en el btn YES
      
      Ademas de esto para poder pasarle el mensaje especifico que queremos que se muestre en la modal
      debemos tener estos imports, esto lo hago donde defino el markup de la modal
      
      import { Component, OnInit, Inject } from "@angular/core";  (Component y OnInit vienen por defecto, debo incluir Inject
      import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
      y ademas inyectar esto en el constructor del componente donde defino el markup de la modal
      
      constructor(@Inject(MAT_DIALOG_DATA) public data,
          public dialogRef: MatDialogRef<ConfirmDialogComponent>
        ) {}

      esto me permite hace algo como esto en el markup {{data.message}} y asi tener el texto que le paso  

      MatDialogRef: me ayuda a definir cual es la modal con la que voy a trabajar  
     * 
     */

    this.confirmDialog
      .openConfirmDialog("Are you sure you want to delete this movie?")
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.service.delete(id).subscribe(res => {
            /** Para refrescar la pantalla y no ver el elemento eliminado pude haber solo llamado a this.ngOnInit(); */
            this.ngOnInit();
            // this.refreshScreen();
            this.toastr.success("Movie deleted successfully", "Movie Rental");
          });
        }
      });
  }

  refreshScreen() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/home"]);
    });
  }

  addMovie() {
    const dialogConfig = new MatDialogConfig();
    // Evitar que se cierre la modal cuando se da un click fuera de ella.
    // esto tambies se logra con esto this.dialog.open(AddMovieComponent, { disableClose: true });
    dialogConfig.disableClose = true;
    // Hace que el primer elemento dentro de la modal coga el focus por defecto
    dialogConfig.autoFocus = true;
    // Hace que la modal ocupe el 60% de toda la window
    // dialogConfig.width = "60%";
    this.dialog.open(AddMovieComponent, dialogConfig)
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

  editMovie(movie: IMovie): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = movie;    
    this.dialog.open(EditMovieComponent, dialogConfig)
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

  updateRating(newRating: number): void {}

  rent(movie: IMovie): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = movie.ID;
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