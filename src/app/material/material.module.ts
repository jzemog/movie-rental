import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatGridListModule,
  MatCheckboxModule,
  MatMenuModule,
  MatSidenavModule,
  MatIconModule,
  MatDividerModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
} from "@angular/material";

const MaterialComponents = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatGridListModule,
  MatCheckboxModule,
  MatMenuModule,
  MatSidenavModule,
  MatIconModule,
  MatDividerModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule
];
@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
