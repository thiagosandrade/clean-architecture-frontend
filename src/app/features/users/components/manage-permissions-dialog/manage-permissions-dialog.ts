import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatCheckboxModule
} from '@angular/material/checkbox';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  firstValueFrom
} from 'rxjs';

import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/permission-response.model';
import { ManagePermissionsDialogData } from '../../models/manage-permissions-dialog-data.model';


@Component({
  selector: 'app-manage-permissions-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-permissions-dialog.html',
  styleUrls: ['./manage-permissions-dialog.scss']
})
export class ManagePermissionsDialogComponent {

  private readonly permissionService =
    inject(PermissionService);

  private readonly dialogRef =
    inject(MatDialogRef<ManagePermissionsDialogComponent>);

  readonly data = inject<ManagePermissionsDialogData>(
    MAT_DIALOG_DATA
  );

  readonly loading = signal(true);

  readonly saving = signal(false);

  readonly permissions =
    signal<PermissionResponse[]>([]);

  readonly selectedPermissionIds =
    signal<Set<string>>(new Set());

  readonly originalPermissionIds =
    signal<Set<string>>(new Set());

  async ngOnInit(): Promise<void> {

    this.loading.set(true);

    const allPermissions =
      await firstValueFrom(
        this.permissionService.getPermissions()
      );

    allPermissions.sort((a, b) =>
      a.description.localeCompare(b.description));

    this.permissions.set(allPermissions);

    const current =
      new Set(
        this.data.permissions.map(x => x.permissionId)
      );

    this.originalPermissionIds.set(
      new Set(current)
    );

    this.selectedPermissionIds.set(
      new Set(current)
    );

    this.loading.set(false);

  }

  isSelected(
    permissionId: string
  ): boolean {

    const selected = this.selectedPermissionIds().has(permissionId);

    return selected;

  }

  togglePermission(
    permissionId: string,
    checked: boolean
  ): void {

    const next =
      new Set(this.selectedPermissionIds());

    if (checked) {

      next.add(permissionId);

    }
    else {

      next.delete(permissionId);

    }

    this.selectedPermissionIds.set(next);

  }

  async save(): Promise<void> {

    this.saving.set(true);

    try {

      const original =
        this.originalPermissionIds();

      const selected =
        this.selectedPermissionIds();

      const toAdd =
        [...selected]
          .filter(x => !original.has(x));

      const toRemove =
        [...original]
          .filter(x => !selected.has(x));

      for (const permissionId of toAdd) {

        await firstValueFrom(

          this.permissionService.setPermission({

            userId: this.data.userId,

            permissionId

          })

        );

      }

      for (const permissionId of toRemove) {

        await firstValueFrom(

          this.permissionService.removePermission({

            userId: this.data.userId,

            permissionId

          })

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

