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
import { TodoItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { MachineState } from '../../../../core/enums/machine-state.enum';
import { TodoBreakdownDialogComponent } from '../../dialogs/todo-breakdown-dialog/todo-breakdown-dialog';
import { MatDialog } from '@angular/material/dialog';
import { formatPriority } from '../../../../core/utils/priority-format.utils';
import { TaskWorkspaceStore } from '../../stores/task-workspace.store';

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

  private readonly workspacestore = inject(TaskWorkspaceStore);
  
  private snack = inject(SnackbarService);

  private dialog = inject(MatDialog);

  @Input({ required: true })
  taskId!: string;

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  @Output()
  subtasksChanged = new EventEmitter<TodoItem['subItems']>();

  readonly todo = signal<TodoItem | null>(null);

  state = signal(MachineState.Loading);

  canSave = false;

  originalSubItems: TodoItem['subItems'] = [];

  readonly DATE_FORMATS = DATE_FORMATS;

  readonly DetailsState = MachineState;

  readonly generatedCount = signal(0);

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if (
      !changes['taskId'] ||
      !this.taskId
    ) {
      return;
    }

    await this.load();

  }

  private async load(): Promise<void> {

    this.setState(MachineState.Loading);

    try {

      const task = this.workspacestore.task();

      if (task == null) {
        return;
      }

      this.todo.set(task);

      this.originalSubItems =
        structuredClone(task.subItems ?? []);

      this.canSave = false;

      this.setState(MachineState.Ready);

    }
    catch {

      this.setState(MachineState.Ready);

    }

  }

  get priorityLabel(): string {
    const todo = this.todo();

    return formatPriority(todo!.priority);
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
    const todo = this.todo();

    return JSON.stringify(todo?.subItems) !== JSON.stringify(this.originalSubItems);
  }

  moveUp(index: number): void {
    if (!this.todo || index === 0) {
      return;
    }

    const todo = this.todo();

    if (!todo) {
      return;
    }

    [todo.subItems[index], todo.subItems[index - 1]] = [todo.subItems[index - 1], todo.subItems[index]];

    this.recalculateOrder();

    this.updateState();
  }

  moveDown(index: number): void {
    if (!this.todo) {
      return;
    }

    const todo = this.todo();

    if (!todo) {
      return;
    }

    if (index >= todo.subItems.length - 1) {
      return;
    }

    [todo.subItems[index], todo.subItems[index + 1]] = [todo.subItems[index + 1], todo.subItems[index]];

    this.recalculateOrder();

    this.updateState();
  }

  toggleCompleted(subtask: TodoItem['subItems'][number]): void {
    subtask.isCompleted = !subtask.isCompleted;

    this.updateState();
  }

  updateDescription(subtask: TodoItem['subItems'][number], value: string): void {
    subtask.description = value;

    this.updateState();
  }

  async save(): Promise<void> {
    if (!this.todo || this.state() === MachineState.Saving) {
      return;
    }

    this.setState(MachineState.Saving);

    try {

      const todo = this.todo();

      if (!todo) {
        return;
      }

      await firstValueFrom(this.service.saveSubItems(todo.id, todo.subItems));

      this.originalSubItems = structuredClone(todo.subItems);

      this.canSave = false;

      this.setState(MachineState.Saved);

      await this.workspacestore.refresh();

      this.snack.success('Subtask updated');

    } catch {
      this.setState(MachineState.Dirty);
    }
  }

  addSubtask(): void {

    const todo = this.todo();

    if (!todo) {
      return;
    }

    const newSubtask = this.createEmptySubtask();

    this.todo.set({
      ...todo,
      subItems: [
        ...todo.subItems,
        newSubtask
      ]
    });

    this.recalculateOrder();

    this.updateState();

  }

  removeSubtask(index: number): void {

    const todo = this.todo();

    if (!todo) {
      return;
    }

    todo.subItems.splice(index, 1);

    this.recalculateOrder();

    this.updateState();
  }

  hasInvalidSubtasks(): boolean {
    const todo = this.todo();
    
    return !!todo?.subItems.some((x) => !x.description.trim());
  }

  openBreakdown(): void {

    const todo = this.todo();

    if (!todo) {
      return;
    }

    const ref = this.dialog.open(
      TodoBreakdownDialogComponent,
      {
        width: '650px',
        data: {
          todoId: todo.id,
          description: todo.description
        }
      }
    );

    ref.afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        const todo = this.todo();

        if (!todo) {
          return;
        }
        
        this.todo.set({
          ...todo,
          subItems: result.subtasks
        });

        this.recalculateOrder();

        this.updateState();

        this.subtasksChanged.emit(result.subtasks);

      });

  }

  private recalculateOrder(): void {
    const todo = this.todo();

    if (!todo) {
      return;
    }
    
    todo.subItems.forEach((x, i) => {
      x.order = i + 1;
    });
  }

  private createEmptySubtask(): TodoItem['subItems'][number] {
    const todo = this.todo();

    return {
      id: '00000000-0000-0000-0000-000000000000',

      todoItemId: todo!.id,

      order: todo!.subItems.length + 1,

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
