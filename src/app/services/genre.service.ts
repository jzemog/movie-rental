import { Injectable } from "@angular/core";
import { IGenre } from "../model/genre";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiServer } from "../model/api-server";

@Injectable({
  providedIn: "root"
})
export class GenreService {
  constructor(private http: HttpClient) {}

  readonly domain = ApiServer;
  genre = {} as IGenre;
  genres: IGenre[];

  form: FormGroup = new FormGroup({
    ID: new FormControl(null),
    Name: new FormControl("", Validators.required)
  });

  async getGenres() {
    const res = await this.http
      .get(`${this.domain}/api/genres/all`)
      .toPromise();
    return (this.genres = res as IGenre[]);
  }

  async getGenre(id: Number) {
    const res = await this.http
      .get(`${this.domain}/api/genres/details/` + id)
      .toPromise();
    return (this.genre = res as IGenre);
  }

  postGenre(genre: IGenre) {
    return this.http.post(`${this.domain}/api/genres/add`, genre);
  }

  updateGenre(genre: IGenre) {
    return this.http.post(`${this.domain}/api/genres/update`, genre);
  }

  deleteGenre(id: Number) {
    return this.http.delete(`${this.domain}/api/genres/remove/` + id);
  }
}
