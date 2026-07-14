import {
  Component,
  Inject,
  inject,
  signal
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  CommonModule
} from '@angular/common';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatRadioModule
} from '@angular/material/radio';

import {
  MatCheckboxModule
} from '@angular/material/checkbox';

import {
  MatInputModule
} from '@angular/material/input';

import {
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  firstValueFrom
} from 'rxjs';

import {
  BreakdownComplexity,
  BreakdownStrategy,
  TodoBreakdownOptions
} from '../../../../core/enums/todo-breakdown-options.enum';

import {
  TodoService
} from '../../services/todo.service';

import {
  TaskItem
} from '../../models/todo.model';
import { MatIconModule } from "@angular/material/icon";
import { mapGeneratedSubtasks as mapBreakdownGeneratedSubtasks } from '../../../../core/utils/map-generated-subtasks';


@Component({
  selector: 'app-todo-breakdown-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './todo-breakdown-dialog.html',
  styleUrls: [
    './todo-breakdown-dialog.scss'
  ]
})
export class TodoBreakdownDialogComponent {

  private fb = inject(FormBuilder);
  private service = inject(TodoService);

  readonly Complexity = BreakdownComplexity;
  readonly Strategy = BreakdownStrategy;

  generating = signal(false);
  previewMode = signal(false);
  generatedSubtasks = signal<TaskItem['subtasks']>([]);
  readonly subtaskCount = signal(0);

  form = this.fb.group({
    complexity: BreakdownComplexity.Standard,
    strategy: BreakdownStrategy.Sequential,
  });

  constructor(
    private dialogRef:
      MatDialogRef<TodoBreakdownDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      todoId: string;
      description: string;
    }

  ) { }

  async generate(): Promise<void> {


    if (this.generating()) {
      return;
    }


    this.generating.set(true);


    try {


      const value =
        this.form.getRawValue();

      const options: TodoBreakdownOptions = {

        complexity:
          value.complexity
          ??
          BreakdownComplexity.Standard,


        strategy:
          value.strategy
          ??
          BreakdownStrategy.Sequential,


      };

      const result =
        await firstValueFrom(

          this.service.breakdown(
            this.data.todoId,
            options
          )

        );

      this.generatedSubtasks.set(
        mapBreakdownGeneratedSubtasks(result.subtasks, this.data.todoId)
      );

      this.previewMode.set(true);

    }
    finally {

      this.generating.set(false);

    }

  }

  updateDescription(index: number, value: string): void {


    const items = this.generatedSubtasks();

    items[index].description = value;

  }

  remove(index: number): void {


    const items = [...this.generatedSubtasks()];

    items.splice(index, 1);

    this.updateItems(items);
  }

  add(): void {

    const items = [...this.generatedSubtasks()];

    items.push({

      id: '00000000-0000-0000-0000-000000000000',

      todoItemId: this.data.todoId,

      order: items.length + 1,

      description: '',

      isCompleted: false,

      completedAt: null,

      createdAt: null

    });

    this.generatedSubtasks.set(items);

  }

  async regenerate(): Promise<void> {

    await this.generate();

  }

  confirm(): void {

    this.dialogRef.close({
      subtasks: this.generatedSubtasks()
    });

  }

  cancel(): void {

    this.dialogRef.close();

  }

  moveUp(index: number): void {

    if (index === 0) {
      return;
    }

    const items = [...this.generatedSubtasks()];

    [items[index], items[index - 1]] =
      [items[index - 1], items[index]];

    this.updateItems(items);
  }

  moveDown(index: number): void {

    const items = [...this.generatedSubtasks()];

    if (index >= items.length - 1) {
      return;
    }

    [items[index], items[index + 1]] =
      [items[index + 1], items[index]];

    this.updateItems(items);
  }

  private recalculateOrder(
    items: TaskItem['subtasks']
  ): void {

    items.forEach((item, index) => {

      item.order = index + 1;

    });

  }

  private updateItems(
    items: TaskItem['subtasks']
  ): void {

    this.recalculateOrder(items);

    this.generatedSubtasks.set(items);

    this.subtaskCount.set(items.length);

  }
}