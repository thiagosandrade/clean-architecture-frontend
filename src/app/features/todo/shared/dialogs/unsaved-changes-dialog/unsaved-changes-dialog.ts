import { Component } from '@angular/core';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unsaved-changes-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './unsaved-changes-dialog.html',
  styleUrls: ['./unsaved-changes-dialog.scss'],
})
export class UnsavedChangesDialogComponent {
  constructor(private dialogRef: MatDialogRef<UnsavedChangesDialogComponent>) {}

  close(result: 'save' | 'discard' | 'cancel') {
    this.dialogRef.close(result);
  }
}
