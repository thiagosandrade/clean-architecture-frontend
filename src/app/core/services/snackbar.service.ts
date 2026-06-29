import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snack: MatSnackBar
  ) {}


  success(message: string) {

    this.open(
      `✓ ${message}`,
      'success'
    );

  }


  error(message: string) {

    this.open(
      `✕ ${message}`,
      'error'
    );

  }


  info(message: string) {

    this.open(
      `ℹ ${message}`,
      'info'
    );

  }


  private open(
    message: string,
    type: string
  ) {

    this.snack.open(
      message,
      'Close',
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: [
          'app-snackbar',
          `snackbar-${type}`
        ]
      }
    );

  }

}