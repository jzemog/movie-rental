import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SettingsComponent } from "./components/shared/settings/settings.component";
import { TopBarComponent } from "./components/shared/top-bar/top-bar.component";
import { SideBarComponent } from "./components/shared/side-bar/side-bar.component";
import { FooterComponent } from "./components/shared/footer/footer.component";
import { ListCustomerComponent } from "./components/customer/list-customer/list-customer.component";
import { AddCustomerComponent } from "./components/customer/add-customer/add-customer.component";
import { EditCustomerComponent } from "./components/customer/edit-customer/edit-customer.component";
import { FormsModule } from "@angular/forms"; /* Esto lo pongo yo y es obligatorio para trabajar con Fomrs*/
import { AuthGuardService } from "./guards/auth-guard.service"; /* comand: ng g s guards/authGuard */
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http"; /* Para interceptors no se instala ningun paquete externo, esta linea la escribo yo */
import { AuthHttpInterceptor } from "./interceptors/auth-httpInterceptor"; /* Para interceptors no se instala ningun paquete externo, esta linea la escribo yo */
import { MaterialModule } from "./material/material.module"; /* Cree un nuevo module dentro de la folder material, que solo contendra los modules importados desde material y lo ke hago es que aqui importo ese otro module */
import { UserService } from "./services/user.service";
import { CustomerService } from "./services/customer.service";
import { ReactiveFormsModule } from "@angular/forms"; /** Esto es con Reactive form approach */
import { ToastrModule } from "ngx-toastr";
import { LoginComponent } from "./components/login/login.component";
import { AddMovieComponent } from "./components/movies/add-movie/add-movie.component";
import { ListMovieComponent } from "./components/movies/list-movie/list-movie.component";
import { EditMovieComponent } from "./components/movies/edit-movie/edit-movie.component";
import { MovieService } from "./services/movie.service";
import { FlexLayoutModule } from "@angular/flex-layout";
import { GenreService } from "./services/genre.service";
import { RatingComponent } from "./components/rating/rating.component";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogService } from "./services/confirm-dialog.service";
import { PhonePipe } from './components/shared/custom-pipes/phone-pipe';
import { ListRentalComponent } from './components/rental/list-rental/list-rental.component';
import { AddRentalComponent } from './components/rental/add-rental/add-rental.component';
import { EditRentalComponent } from './components/rental/edit-rental/edit-rental.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    TopBarComponent,
    SideBarComponent,
    FooterComponent,
    ListCustomerComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    LoginComponent,
    AddMovieComponent,
    ListMovieComponent,
    EditMovieComponent,
    RatingComponent,
    ConfirmDialogComponent,
    PhonePipe,
    ListRentalComponent,
    AddRentalComponent,
    EditRentalComponent,
    PageNotFoundComponent,
    MessageDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    UserService,
    CustomerService,
    MovieService,
    GenreService,
    ConfirmDialogService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddMovieComponent, ConfirmDialogComponent, EditMovieComponent, AddRentalComponent, MessageDialogComponent]
})
export class AppModule {}
