import {
  Component,
  Inject,
  OnInit,
  computed,
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
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  firstValueFrom
} from 'rxjs';

import { TodoService } from '../../../services/todo.service';
import { UserService } from '../../../../user/services/user.service';
import { TaskSearchResult } from '../../../models/task-search-response.model';



@Component({
  selector: 'app-task-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-search-dialog.html',
  styleUrls: ['./task-search-dialog.scss']
})
export class TaskSearchDialogComponent implements OnInit {

  private readonly service =
    inject(TodoService);

  readonly search =
    new FormControl('', { nonNullable: true });

  readonly loading =
    signal(false);

  readonly tasks =
    signal<TaskSearchResult[]>([]);

  readonly selected =
    signal<TaskSearchResult | null>(null);

  readonly hasResults =
    computed(() => this.tasks().length > 0);

  constructor(

    private dialogRef: MatDialogRef<TaskSearchDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: any

  ) { }

  ngOnInit(): void {

    this.search.valueChanges.pipe(

      debounceTime(300),

      distinctUntilChanged(),

      filter(x => x.trim().length >= 2)

    ).subscribe(value => {

      void this.searchTasks(value);

    });

  }

  private async searchTasks(
    description: string
  ): Promise<void> {

    this.loading.set(true);

    try {

      let tasks =
        await firstValueFrom(

          this.service.searchByDescription(
            description
          )

        );

      if (this.data?.excludeTaskId) {

        tasks =
          tasks.filter(
            x => x.id !== this.data.excludeTaskId
          );

      }

      this.tasks.set(tasks);

      if (tasks.length === 0) {

        this.selected.set(null);

      }

    }
    finally {

      this.loading.set(false);

    }

  }

  select(
    task: TaskSearchResult
  ): void {

    this.selected.set(task);

  }

  doubleClick(
    task: TaskSearchResult
  ): void {

    this.dialogRef.close(task);

  }

  confirm(): void {

    if (!this.selected()) {
      return;
    }

    this.dialogRef.close(
      this.selected()
    );

  }

  cancel(): void {

    this.dialogRef.close();

  }

  isSelected(
    task: TaskSearchResult
  ): boolean {

    return this.selected()?.id === task.id;

  }

}