import { Component, OnInit, Inject, SecurityContext } from "@angular/core";
import { MovieService } from "src/app/services/movie.service";
import { GenreService } from "src/app/services/genre.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material";
import { IMovie } from "src/app/model/movie";
import { FormGroup, FormBuilder } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { AddRentalComponent } from '../../rental/add-rental/add-rental.component';

@Component({
  selector: "app-edit-movie",
  templateUrl: "./edit-movie.component.html",
  styleUrls: ["./edit-movie.component.css"]
})
export class EditMovieComponent implements OnInit {
  imageToShow: string = "/assets/img/default-image.jpg";
  fileToUpload: File = null;
  rating: number;
  form: FormGroup;
  ident: number;

  constructor(
    public service: MovieService,
    public genreService: GenreService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<EditMovieComponent>,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: IMovie
  ) {}

  ngOnInit() {
    this.genreService.getGenres();
    this.service.form = this.formBuilder.group({
      ID: this.data.ID,
      Title: this.data.Title,
      Description: this.data.Description,
      Image: this.data.Image,
      ImageUrl: this.data.ImageUrl,
      GenreId: this.data.GenreId,
      Genre: "",
      Director: this.data.Director,
      Writer: this.data.Writer,
      Producer: this.data.Producer,
      ReleaseDate: this.data.ReleaseDate,
      Rating: this.data.Rating,
      TrailerURI: this.data.TrailerURI
    });
    this.rating = this.data.Rating;
    this.imageToShow = this.data.ImageUrl;
    this.ident = this.data.ID;
  }

  onClose(): void {
    this.resetForm();
    this.dialogRef.close();
  }

  handleFileInput(file: FileList): void {
    this.fileToUpload = file.item(0);
    // Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageToShow = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  uploadImage(id: number): void {
    this.service.uploadImage(id, this.fileToUpload).subscribe(res => {
      this.toastr.success("Movie updated successfully", "Movie Rental");
      this.refreshScreen();
      this.onClose();
    });
  }

  refreshScreen(): void {
    this.resetForm(); // resets the values of the modal
    /** esto lo comente porke me hacia que la pantalla blinking cuando cerraba el material dialog 
      * entonces lo ke hago es llamar al ngOnInit del la view listar y asi evito el blinking */
    // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //   this.router.navigate(["/home"]);
    // });
  }

  updateRating(newRating: number): void {
    this.rating = newRating;
  }

  editMovie(): void {
    if (this.service.form.valid) {
      this.service.form.value.Rating = this.rating;
      // trust in the field. Re-do what I did in ListMovieComponent. Aqui inserto la misma ImageUrl que esta en la DB ya que ese
      // valor se modificaria si el user escogio una imagen nueva y eso se haria en la webapi, no tiene nada que ver con angular
      this.service.form.value.ImageUrl = this.sanitizer.sanitize(
        SecurityContext.URL,
        this.imageToShow
      );
      this.service.update(this.service.form.value).subscribe(res => {
        let movie = res as IMovie;
        if (this.fileToUpload != null) {
          this.uploadImage(movie.ID);
        } else {
          this.toastr.success("Movie updated successfully", "Movie Rental");
          this.refreshScreen();
          this.onClose();
        }
      });
    } else {
      console.log("something wrong");
    }
  }  

  // found this online, approach to clear the modal, since doing just this.service.resetFormGroup() was no working with cleaning the validations
  resetForm(){
    this.service.resetFormGroup()
    this.service.form.markAsPristine();
    this.service.form.markAsUntouched();
  }
}
