import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';

import { firstValueFrom } from 'rxjs';

import { DATE_FORMATS } from '../../../../core/constants/date.constants';
import { TaskItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { MachineState } from '../../../../core/enums/machine-state.enum';
import { TodoBreakdownDialogComponent } from '../../shared/dialogs/todo-breakdown-dialog/todo-breakdown-dialog';
import { MatDialog } from '@angular/material/dialog';
import { formatPriority } from '../../../../core/utils/priority-format.utils';

@Component({
  selector: 'app-todo-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIcon,
    MatCheckboxModule,
  ],
  templateUrl: './todo-details.html',
  styleUrls: ['./todo-details.scss'],
})
export class TodoDetailsComponent implements OnChanges {
  private service = inject(TodoService);

  private snack = inject(SnackbarService);

  private dialog = inject(MatDialog);

  @Input({ required: true })
  todo!: TaskItem;

  @Output()
  refreshRequested = new EventEmitter<void>();

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  @Output()
  subtasksChanged = new EventEmitter<TaskItem['subtasks']>();

  state = signal(MachineState.Loading);

  canSave = false;

  originalSubItems: TaskItem['subtasks'] = [];

  readonly DATE_FORMATS = DATE_FORMATS;

  readonly DetailsState = MachineState;

  readonly generatedCount = signal(0);

  private currentTodoId?: string;

  ngOnChanges(changes: SimpleChanges): void {

    if (!changes['todo'] || !this.todo) {
      return;
    }

    const isNewTodo =
      this.currentTodoId !== this.todo.id;


    if (!isNewTodo) {
      return;
    }


    this.currentTodoId = this.todo.id;


    this.setState(MachineState.Loading);


    this.originalSubItems =
      structuredClone(this.todo.subtasks ?? []);


    this.canSave = false;


    this.setState(MachineState.Ready);

  }

  get priorityLabel(): string {
    return formatPriority(this.todo.priority);
  }
  
  isLoading(): boolean {
    return this.state() === MachineState.Loading;
  }

  isSaving(): boolean {
    return this.state() === MachineState.Saving;
  }

  isBreakingDown(): boolean {
    return this.state() === MachineState.BreakingDown;
  }

  private updateState(): void {
    const dirty = this.hasChanges();

    this.canSave = dirty && !this.hasInvalidSubtasks();

    this.setState(dirty ? MachineState.Dirty : MachineState.Ready);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.todo?.subtasks) !== JSON.stringify(this.originalSubItems);
  }

  moveUp(index: number): void {
    if (!this.todo || index === 0) {
      return;
    }

    const items = this.todo.subtasks;

    [items[index], items[index - 1]] = [items[index - 1], items[index]];

    this.recalculateOrder();

    this.updateState();
  }

  moveDown(index: number): void {
    if (!this.todo) {
      return;
    }

    const items = this.todo.subtasks;

    if (index >= items.length - 1) {
      return;
    }

    [items[index], items[index + 1]] = [items[index + 1], items[index]];

    this.recalculateOrder();

    this.updateState();
  }

  toggleCompleted(subtask: TaskItem['subtasks'][number]): void {
    subtask.isCompleted = !subtask.isCompleted;

    this.updateState();
  }

  updateDescription(subtask: TaskItem['subtasks'][number], value: string): void {
    subtask.description = value;

    this.updateState();
  }

  async save(): Promise<void> {
    if (!this.todo || this.state() === MachineState.Saving) {
      return;
    }

    this.setState(MachineState.Saving);

    try {
      await firstValueFrom(this.service.saveSubItems(this.todo.id, this.todo.subtasks));

      this.originalSubItems = structuredClone(this.todo.subtasks);

      this.canSave = false;

      this.setState(MachineState.Saved);

      this.refreshRequested.emit();

      this.snack.success('Subtask updated');

    } catch {
      this.setState(MachineState.Dirty);
    }
  }

  addSubtask(): void {
    if (!this.todo) {
      return;
    }

    const newSubtask = this.createEmptySubtask();

    this.todo = {
      ...this.todo,
      subtasks: [
        ...this.todo.subtasks,
        newSubtask
      ]
    };

    this.recalculateOrder();
    
    this.updateState();
  }

  removeSubtask(index: number): void {
    if (!this.todo) {
      return;
    }

    this.todo.subtasks.splice(index, 1);

    this.recalculateOrder();

    this.updateState();
  }

  hasInvalidSubtasks(): boolean {
    return !!this.todo?.subtasks.some((x) => !x.description.trim());
  }

  openBreakdown(): void {

    const ref = this.dialog.open(
      TodoBreakdownDialogComponent,
      {
        width: '650px',
        data: {
          todoId: this.todo.id,
          description: this.todo.description
        }
      }
    );

    ref.afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        this.todo = {
          ...this.todo,
          subtasks: result.subtasks
        };

        this.recalculateOrder();

        this.updateState();

        this.subtasksChanged.emit(result.subtasks);

      });

  }

  private recalculateOrder(): void {
    this.todo!.subtasks.forEach((x, i) => {
      x.order = i + 1;
    });
  }

  private createEmptySubtask(): TaskItem['subtasks'][number] {
    return {
      id: '00000000-0000-0000-0000-000000000000',

      todoItemId: this.todo!.id,

      order: this.todo!.subtasks.length + 1,

      description: '',

      isCompleted: false,

      completedAt: null,

      createdAt: null,
    };
  }

  private setState(state: MachineState): void {
    this.state.set(state);

    switch (state) {
      case MachineState.Loading:

      case MachineState.Ready:
        this.statusChanged.emit('none');

        break;

      case MachineState.Dirty:
        this.statusChanged.emit('dirty');

        break;

      case MachineState.Saving:
        this.statusChanged.emit('saving');

        break;

      case MachineState.Saved:
        this.statusChanged.emit('saved');

        break;
    }
  }
}
