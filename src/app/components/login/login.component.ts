import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  show: Boolean = false;
  constructor(
    public service: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.resetForm();
    // this.service.user.Email = "as@as.com";
    // this.service.user.Password = "asasas";
    this.service.form = new FormGroup({
      Email: new FormControl("as@as.com", [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
      Password: new FormControl("asasas", [Validators.required])
    });
  }

  // resetForm(form?: NgForm) {
  //   if (form != null) {
  //     form.reset();
  //   }
  //   this.service.user = {
  //     UserName: "",
  //     Password: "",
  //     Email: ""
  //   };
  // }

  // login(form: NgForm) {
  //   this.show = true;
  //   this.service.authentication(form.value).subscribe(
  //     (data: any) => {
  //       localStorage.setItem("userToken", data.access_token);
  //       localStorage.setItem("userName", data.userName);
  //       this.router.navigate(["/home"]);
  //       this.toastr.success("User authentication successfully", "Movie Rental");
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.show = false;
  //       console.log(error);
  //       this.toastr.error("Please check the username and password", "Movie Rental");
  //     }
  //   );
  // }

  login(): void {
    this.show = true;
    this.service.authentication(this.service.form.value).subscribe(
      (data: any) => {
        localStorage.setItem("userToken", data.access_token);
        localStorage.setItem("userName", data.userName);
        this.router.navigate(["/home"]);
        this.toastr.success("User authentication successfully", "Movie Rental");
      },
      (error: HttpErrorResponse) => {
        this.show = false;
        console.log(error);
        this.toastr.error("Please check the username and password", "Movie Rental");
      }
    );
  }
}
