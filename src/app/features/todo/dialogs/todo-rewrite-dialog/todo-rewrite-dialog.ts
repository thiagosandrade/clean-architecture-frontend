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

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { firstValueFrom } from 'rxjs';
import { RewriteStyle, rewriteStyleLabels } from '../../../../core/enums/rewrite-style.enum';
import { TaskItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';


@Component({
  selector: 'app-todo-rewrite-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './todo-rewrite-dialog.html',
  styleUrls: ['./todo-rewrite-dialog.scss']
})
export class TodoRewriteDialogComponent {

  private service = inject(TodoService);

  readonly loading = signal(false);

  readonly rewritten = signal<string | null>(null);

  selectedStyle: RewriteStyle = RewriteStyle.Professional;

  readonly styles = rewriteStyleLabels;

  constructor(
    private dialogRef: MatDialogRef<TodoRewriteDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public todo: TaskItem
  ) {}

  async rewrite(): Promise<void> {

    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const response =
        await firstValueFrom(

          this.service.rewrite(
            this.todo.id,
            {
              userId:
                localStorage.getItem('id') ?? '',

              description:
                this.todo.description,

              style:
                this.selectedStyle
            }
          )

        );

      this.rewritten.set(
        response.description
      );

    }
    finally {

      this.loading.set(false);

    }

  }

  async rewriteAgain(): Promise<void> {

    this.rewritten.set(null);

    await this.rewrite();

  }

  accept(): void {

    if (!this.rewritten()) {
      return;
    }

    this.dialogRef.close({
      description: this.rewritten()
    });

  }

  cancel(): void {

    this.dialogRef.close();

  }

}