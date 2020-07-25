import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: "root"
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(msg: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: "410px",
      panelClass: "confirm-dialog-container",
      disableClose: true,
      data: {
        message: msg
      }
    });
  }
}
