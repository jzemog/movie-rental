import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: []
})
export class TopBarComponent implements OnInit {
  visible: boolean = true;
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private userServie: UserService
  ) {
    this.visible = false; // set toolbar visible to false
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(
        filter(route => route.outlet === "primary"),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        // this.viewedPage = event.title; // title of page
        this.showToolbar(event.toolbar); // show the toolbar?
      });
  }

  showToolbar(event) {
    if (event === false) {
      this.visible = false;
    } else if (event === true) {
      this.visible = true;
    } else {
      this.visible = this.visible;
    }
  }

  logout(): void {
    this.userServie.logout();
    this.router.navigate(["/login"]);
  }
}
