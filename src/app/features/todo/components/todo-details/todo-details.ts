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

  @Input({ required: true })
  todo!: TodoItem;

  @Output()
  refreshRequested = new EventEmitter<void>();

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  state = signal(MachineState.Loading);

  canSave = false;

  originalSubItems: TodoItem['subItems'] = [];

  readonly DATE_FORMATS = DATE_FORMATS;

  readonly DetailsState = MachineState;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['todo'] || !this.todo) {
      return;
    }

    this.setState(MachineState.Loading);

    this.originalSubItems = structuredClone(this.todo.subItems ?? []);

    this.canSave = false;

    this.setState(MachineState.Ready);
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
    return JSON.stringify(this.todo?.subItems) !== JSON.stringify(this.originalSubItems);
  }

  moveUp(index: number): void {
    if (!this.todo || index === 0) {
      return;
    }

    const items = this.todo.subItems;

    [items[index], items[index - 1]] = [items[index - 1], items[index]];

    this.recalculateOrder();

    this.updateState();
  }

  moveDown(index: number): void {
    if (!this.todo) {
      return;
    }

    const items = this.todo.subItems;

    if (index >= items.length - 1) {
      return;
    }

    [items[index], items[index + 1]] = [items[index + 1], items[index]];

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
      await firstValueFrom(this.service.saveSubItems(this.todo.id, this.todo.subItems));

      this.originalSubItems = structuredClone(this.todo.subItems);

      this.canSave = false;

      this.setState(MachineState.Saved);

      this.snack.success('Subtask updated');

    } catch {
      this.setState(MachineState.Dirty);
    }
  }

  addSubtask(): void {
    if (!this.todo) {
      return;
    }

    this.todo.subItems.push(this.createEmptySubtask());

    this.updateState();
  }

  removeSubtask(index: number): void {
    if (!this.todo) {
      return;
    }

    this.todo.subItems.splice(index, 1);

    this.recalculateOrder();

    this.updateState();
  }

  hasInvalidSubtasks(): boolean {
    return !!this.todo?.subItems.some((x) => !x.description.trim());
  }

  async breakDown(): Promise<void> {
    if (!this.todo) {
      return;
    }

    this.setState(MachineState.BreakingDown);

    try {
      await firstValueFrom(this.service.breakdown(this.todo.id));

      this.refreshRequested.emit();

      this.snack.success('Subtasks generated');
    } catch {
      this.setState(MachineState.Ready);
    }
  }

  hasSubtasks(): boolean {
    return (this.todo?.subItems.length ?? 0) > 0;
  }

  private recalculateOrder(): void {
    this.todo!.subItems.forEach((x, i) => {
      x.order = i + 1;
    });
  }

  private createEmptySubtask(): TodoItem['subItems'][number] {
    return {
      id: '00000000-0000-0000-0000-000000000000',

      todoItemId: this.todo!.id,

      order: this.todo!.subItems.length + 1,

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
