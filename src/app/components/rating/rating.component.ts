import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.css"]
})
export class RatingComponent implements OnInit {
  constructor() {}

  /**
   * Aqui necesito enviar el rating al componente AddMovieComponent (padre)
   * debo importar EventEmitter y Output y declarar la variable que se va a
   * enviar asi @Output() rating = new EventEmitter<number>(); despues uso
   * "var".emit("valor que se va a recivir en el padre")
   */

  stars: number[] = [1, 2, 3, 4, 5];
  @Input() inRating: number;
  @Output() rating: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
  }

  countStars(star: number) {
    this.inRating = star;
    this.rating.emit(star);
  }
}



