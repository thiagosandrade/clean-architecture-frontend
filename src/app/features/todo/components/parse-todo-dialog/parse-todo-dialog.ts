import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { ParsedTodo } from '../../models/parsed-todo-response.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-parse-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './parse-todo-dialog.html',
  styleUrls: ['./parse-todo-dialog.scss'],
})
export class ParseTodoDialogComponent {
  private fb = inject(FormBuilder);

  private service = inject(TodoService);

  private dialogRef = inject(MatDialogRef<ParseTodoDialogComponent>);

  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    text: ['', Validators.required],
  });

  result?: ParsedTodo;

  isGenerating = false;

  generate() {
    const text = this.form.value.text;

    if (!text) {
      return;
    }

    this.isGenerating = true;
    this.result = undefined;

    this.service.parseTodo(text).subscribe({
      next: (response) => {
        this.result = response;

        this.isGenerating = false;

        this.cdr.detectChanges();
      },

      error: () => {
        setTimeout(() => {
          this.isGenerating = false;
        });
      },
    });
  }

  confirm() {
    this.dialogRef.close(this.result);
  }

  cancel() {
    this.dialogRef.close();
  }
}
