import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";

import { IMovie } from "src/app/model/movie";
import { MovieService } from "src/app/services/movie.service";
import { GenreService } from "src/app/services/genre.service";
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';

@Component({
  selector: "app-add-movie",
  templateUrl: "./add-movie.component.html",
  styleUrls: ["./add-movie.component.css"]
})
export class AddMovieComponent implements OnInit {
  constructor(
    public service: MovieService,
    public genreService: GenreService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<AddMovieComponent>,
    private dialog: MatDialog,
  ) {}

  imageToShow: string = "/assets/img/default-image.jpg";
  fileToUpload: File = null;
  /** rating viene desde el RatingComponent usando @Output, ver funcion getRating() mas abajo
   * y como uso el child component <rating></rating> en el markup de este component
   */
  rating: number;

  ngOnInit() {
    this.genreService.getGenres();
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    // Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageToShow = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  addMovie() {
    if (this.fileToUpload !== null) {
      if (this.service.form.valid) {
        this.service.form.value.Rating = this.rating;
        this.service.create(this.service.form.value).subscribe(res => {
          let movie = res as IMovie;
          this.uploadImage(movie.ID);
        });
      } else {
        console.log("something wrong");
      }
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        message: "Please select the movie image."
      }
      this.dialog.open(MessageDialogComponent, dialogConfig);
    }
  }

  uploadImage(id: number) {
    this.service.uploadImage(id, this.fileToUpload).subscribe(res => {
      this.toastr.success("Movie inserted successfully", "Movie Rental");
      this.refreshScreen();
      this.onClose();
    });
  }

  onClose() {
    this.resetForm();
    this.dialogRef.close();
  }

  refreshScreen() {
    this.resetForm(); // reset the values of the modal
    /** esto lo comente porke me hacia que la pantalla blinking cuando cerraba el material dialog 
      * entonces lo ke hago es llamar al ngOnInit del la view listar y asi evito el blinking */
    // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //   this.router.navigate(["/home"]);
    // });
  }

  getRating(star: number) {
    this.rating = star;
  }

  // found this online, approach to clear the modal, since doing just this.service.resetFormGroup() was no working with cleaning the validations
  resetForm(){
    this.service.resetFormGroup()
    this.service.form.markAsPristine();
    this.service.form.markAsUntouched();
  }
}
