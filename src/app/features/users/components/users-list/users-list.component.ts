import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatTableModule
} from '@angular/material/table';

import {
  MatChipsModule
} from '@angular/material/chips';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  firstValueFrom
} from 'rxjs';

import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user-response.model';
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog';
import { MatMenuModule } from "@angular/material/menu";
import { ManagePermissionsDialogComponent } from '../manage-permissions-dialog/manage-permissions-dialog';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule
],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {


  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog)
  private readonly snackbar = inject(SnackbarService)

  readonly loading = signal(true);

  readonly users = signal<UserResponse[]>([]);

  readonly displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'createdOn',
    'permissions',
    'actions'
  ];

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    try {

      const users =
        await firstValueFrom(
          this.userService.getAll()
        );

      this.users.set(users);

    }
    finally {

      this.loading.set(false);

    }

  }

  openUserForm(operation: string, user?: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
          width: '900px',
          maxWidth: '95vw',
          height: 'auto',
          maxHeight: '90vh',
          data: {
              mode: operation,
              user: user
          },
        });

    dialogRef.afterClosed()
      .subscribe(created => {

        if (created) {

          this.loadUsers();

          
        }

      });
  }

  managePermissions(user: UserResponse): void {
  
    const dialogRef = this.dialog.open(ManagePermissionsDialogComponent, {
          width: '900px',
          maxWidth: '95vw',
          height: 'auto',
          maxHeight: '90vh',
          data: {
              userId: user.id,
              userName: `${user.firstName} ${user.lastName}`,
              email: user.email,
              permissions: user.permissions
          },
        });

    dialogRef.afterClosed()
      .subscribe(updated => {

        if(updated){

            this.loadUsers();

            this.snackbar.success(
              'Permissions Updated.'
            );

        }
      });

  }

}