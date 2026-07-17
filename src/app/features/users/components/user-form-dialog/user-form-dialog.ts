import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  firstValueFrom
} from 'rxjs';

import { UserService } from '../../services/user.service';
import { UserFormDialogData } from '../../models/user-form-dialog-data.model';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form-dialog.html',
  styleUrls: ['./user-form-dialog.scss']
})
export class UserFormDialogComponent {

  private readonly fb = inject(FormBuilder);

  private readonly userService = inject(UserService);
  
  private readonly snackbar = inject(SnackbarService);

  private readonly dialogRef =
    inject(MatDialogRef<UserFormDialogComponent>);

  readonly data = inject<UserFormDialogData>(
    MAT_DIALOG_DATA
  );
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({

    firstName:
      [
        this.data.user?.firstName ?? '',
        Validators.required
      ],

    lastName: [
      this.data.user?.lastName ?? '',
      Validators.required
    ],

    email: [
      this.data.user?.email ?? '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.minLength(8)
      ]
    ]

  });

  async save(): Promise<void> {

    this.saving.set(true);

    try {

      if (this.data.mode === 'create') {

        await firstValueFrom(this.userService.register(
          this.form.getRawValue()
        ));

        this.snackbar.success(
          'User created.'
        );
      }
      else {

        await firstValueFrom(this.userService.updateUser(
          this.data.user!.id,
          {
            email: this.form.value.email!,
            firstName: this.form.value.firstName!,
            lastName: this.form.value.lastName!
          }
        ));

        this.snackbar.success(
          'User updated.'
        );

      }

      this.dialogRef.close(true);

    }
    finally {

      this.saving.set(false);

    }

  }

  cancel(): void {

    this.dialogRef.close(false);

  }

}