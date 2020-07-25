import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "./guards/auth-guard.service";
import { LoginComponent } from "./components/login/login.component";
import { ListCustomerComponent } from "./components/customer/list-customer/list-customer.component";
import { AddCustomerComponent } from "./components/customer/add-customer/add-customer.component";
import { EditCustomerComponent } from "./components/customer/edit-customer/edit-customer.component";
import { ListMovieComponent } from "./components/movies/list-movie/list-movie.component";
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';

/* data: { toolbar: false } controla si mostrar o no las templates como header, footer, menu (sidebar) */
const routes: Routes = [  
  { 
    path: "login", 
    component: LoginComponent, 
    data: { toolbar: false } 
  },
  {
    path: "home",
    component: ListMovieComponent,
    data: { toolbar: true },
    canActivate: [AuthGuardService]
  },
  {
    path: "customers",
    component: ListCustomerComponent,
    data: { toolbar: true },
    canActivate: [AuthGuardService]
  },
  {
    path: "customer-add",
    component: AddCustomerComponent,
    data: { toolbar: true },
    canActivate: [AuthGuardService]
  },
  {
    path: "customer-edit/:id",
    component: EditCustomerComponent,
    data: { toolbar: true },
    canActivate: [AuthGuardService]
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
