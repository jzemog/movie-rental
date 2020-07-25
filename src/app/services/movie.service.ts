import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IMovie } from "../model/movie";
import { map } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiServer } from "../model/api-server";

@Injectable({
  providedIn: "root"
})
export class MovieService {
  constructor(private http: HttpClient) {}

  readonly domain = ApiServer;
  movie = {} as IMovie;
  movies: IMovie[]; /** Esto es necesatio solo para Ej:2 y Ej:3 de los Get  */
  form: FormGroup = new FormGroup({
    ID: new FormControl(null),
    Title: new FormControl("", Validators.required),
    Description: new FormControl(""),
    Image: new FormControl(""),
    ImageUrl: new FormControl(""),
    GenreId: new FormControl(1, Validators.required),
    Genre: new FormControl(""),
    Director: new FormControl("", Validators.required),
    Writer: new FormControl("", Validators.required),
    Producer: new FormControl(""),
    ReleaseDate: new FormControl(""),
    Rating: new FormControl(0),
    TrailerURI: new FormControl("")
  });

  resetFormGroup() {
    this.form.setValue({
      ID: null,
      Title: "",
      Description: "",
      Image: "",
      ImageUrl: "",
      GenreId: 0,
      Genre: "",
      Director: "",
      Writer: "",
      Producer: "",
      ReleaseDate: "",
      Rating: 0,
      TrailerURI: ""
    });
  }

  getMovies() {
    return this.http.get(`${this.domain}/api/movies/all`).pipe(map(res => res));
  }

  async getMovie(id: Number) {
    const res = await this.http
      .get(`${this.domain}/api/movies/details/` + id)
      .toPromise();
    return (this.movie = res as IMovie);
  }

  uploadImage(id: number, fileToUpload: File) {
    const caption = "testing";
    const formData: FormData = new FormData();
    formData.append("Image", fileToUpload, fileToUpload.name);
    formData.append("ImageCaption", caption);
    return this.http.post(
      `${this.domain}/api/movies/images/upload?movieId=` + id,
      formData
    );
  }

  // async addMovie(movie: Movie) {
  //   console.log(movie);
  //   const res = await this.http
  //     .post(`${this.domain}/api/movies/add`, movie)
  //     .toPromise().then();
  //   console.log(res);
  //   return this.uploadImage((this.movie = res as any));
  // }

  create(movie: IMovie) {
    delete movie.ID;
    return this.http.post(`${this.domain}/api/movies/add`, movie);
  }

  update(movie: IMovie) {
    return this.http.post(`${this.domain}/api/movies/update`, movie);
  }

  delete(id: Number) {
    return this.http.delete(`${this.domain}/api/movies/remove/` + id);
  }

}
