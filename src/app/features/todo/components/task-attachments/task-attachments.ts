import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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

import {
  TodoService
} from '../../services/todo.service';

import {
  SnackbarService
} from '../../../../core/services/snackbar.service';

import {
  WorkspaceStatus
} from '../../../../core/enums/workspace-status.enum';

import {
  MachineState
} from '../../../../core/enums/machine-state.enum';

import {
  TaskWorkspaceStore
} from '../../stores/task-workspace.store';
import { TaskAttachment } from "../../models/task-attachment-response";
import { downloadFile } from '../../../../core/utils/download-helper.utils';
import { formatFileSize } from '../../../../core/utils/format-file-size.utils';

@Component({
  selector: 'app-task-attachments',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-attachments.html',
  styleUrls: ['./task-attachments.scss']
})
export class TaskAttachmentsComponent implements OnInit {

  private readonly service =
    inject(TodoService);

  private readonly snack =
    inject(SnackbarService);

  readonly workspaceStore =
    inject(TaskWorkspaceStore);

  @Input({ required: true })
  taskId!: string;

  @Output()
  statusChanged =
    new EventEmitter<WorkspaceStatus>();

  readonly state =
    signal(MachineState.Ready);

  readonly uploading =
    signal(false);

  readonly attachments =
    signal<TaskAttachment[]>([]);

  readonly formatFileSize = formatFileSize;

  ngOnInit(): void {

    this.load();

  }

  private async load(): Promise<void> {
    await this.loadAttachments();
  }

  private async loadAttachments(): Promise<void> {

    this.setState(MachineState.Loading);

    try {

      const response =
        await firstValueFrom(

          this.service.getAttachments(
            this.taskId
          )

        );

      this.attachments.set(response.attachments);

    }
    finally {

      this.setState(MachineState.Ready);

    }

  }

  async upload(
    event: Event
  ): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file =
      input.files[0];

    this.uploading.set(true);

    this.setState(MachineState.Saving);

    try {

      await firstValueFrom(

        this.service.createAttachment(
          this.taskId,
          file
        )

      );

      await this.workspaceStore.refresh();

      this.setState(MachineState.Saved);

      this.snack.success(
        'Attachment uploaded'
      );

    }
    catch {

      this.setState(MachineState.Ready);

    }
    finally {

      input.value = '';

      this.uploading.set(false);

    }

  }

  async delete(
    attachment: TaskAttachment
  ): Promise<void> {

    this.setState(MachineState.Saving);

    try {

      await firstValueFrom(

        this.service.deleteAttachment(
          this.taskId,
          attachment.id
        )

      );

      await this.workspaceStore.refresh();

      this.setState(MachineState.Saved);

      this.snack.success(
        'Attachment deleted'
      );

    }
    catch {

      this.setState(MachineState.Ready);

    }

  }

  async download(
    attachment: TaskAttachment
  ): Promise<void> {

    const blob =
      await firstValueFrom(

        this.service.downloadAttachment(
          this.taskId,
          attachment.id
        )

      );

    downloadFile(
      blob,
      attachment.originalFileName
    );

  }

  trackByAttachment(
    index: number,
    attachment: TaskAttachment
  ): string {

    return attachment.id;

  }

  isSaving(): boolean {

    return this.state() === MachineState.Saving;

  }

  private setState(
    state: MachineState
  ): void {

    this.state.set(state);

    switch (state) {

      case MachineState.Ready:

      case MachineState.Loading:

        this.statusChanged.emit('none');

        break;

      case MachineState.Saving:

        this.statusChanged.emit('saving');

        break;

      case MachineState.Saved:

        this.statusChanged.emit('saved');

        break;

      case MachineState.Dirty:

        this.statusChanged.emit('dirty');

        break;

    }

  }

}

