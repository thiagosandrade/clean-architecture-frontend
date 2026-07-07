import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
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
    MatCheckboxModule
  ],
  templateUrl: './todo-details.html',
  styleUrls: ['./todo-details.scss']
})
export class TodoDetailsComponent implements OnInit, OnChanges {

  private service = inject(TodoService);
  private snack = inject(SnackbarService);

  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true })
  todoId!: string;

  @Input()
  refreshTrigger = 0;

  @Output()
  refreshRequested = new EventEmitter<void>();

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  todo?: TodoItem;

  state = signal(MachineState.Loading);
  canSave = false;

  originalSubItems: TodoItem['subItems'] = [];

  readonly DATE_FORMATS = DATE_FORMATS;

  readonly DetailsState = MachineState;

  isLoading(): boolean {
    return this.state() === MachineState.Loading;
  }

  isSaving(): boolean {
    return this.state() === MachineState.Saving;
  }

  isBreakingDown(): boolean {
    return this.state() === MachineState.BreakingDown;
  }

  ngOnInit(): void {

    this.load();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['todoId'] && !changes['todoId'].firstChange) {
      this.load();
    }
    else if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.load();
    }

  }

  private updateState(): void {
    const dirty = this.hasChanges();
    this.canSave = dirty && !this.hasInvalidSubtasks();
    this.statusChanged.emit(dirty ? 'dirty' : 'none');
  } 

  load(): void {

    this.state.set(MachineState.Loading);

    this.todo = undefined;

    this.service
      .getById(this.todoId)
      .subscribe(todo => {

        this.todo = todo;
        this.originalSubItems = structuredClone(todo.subItems);

        this.finishLoading();
      });

  }

  hasChanges(): boolean {

    return JSON.stringify(this.todo?.subItems) !==
          JSON.stringify(this.originalSubItems);

  }

  moveUp(index: number): void {

    if (!this.todo || index === 0) {
      return;
    }

    const items = this.todo.subItems;

    [items[index], items[index - 1]] =
      [items[index - 1], items[index]];

    this.recalculateOrder();

    this.updateState();

  }

  moveDown(index: number): void {

    const todo = this.todo;

    if (!todo) {
      return;
    }

    const items = todo.subItems;

    if (index >= items.length - 1) {
      return;
    }

    [items[index], items[index + 1]] =
      [items[index + 1], items[index]];

    this.recalculateOrder();

    this.updateState();

  }

  toggleCompleted(subtask: TodoItem['subItems'][number]): void {

    subtask.isCompleted = !subtask.isCompleted;

    this.updateState();

  }

  updateDescription(
    subtask: TodoItem['subItems'][number],
    value: string
  ): void {

    subtask.description = value;

    this.updateState();

  }

  save(): void {

    const todo = this.todo;

    if (!todo) {
      return;
    }

    this.state.set(MachineState.Saving);

    this.service
      .saveSubItems(
        todo.id,
        todo.subItems
      )
      .subscribe({

        next: () => {

          this.originalSubItems = structuredClone(todo.subItems);

          this.updateState();

          this.refreshRequested.emit();
          this.statusChanged.emit('saved');

          this.snack.success('Subtask updated');

          this.finishSaving();
        },
        error: () => {
          this.finishSaving();
        }
      });
  }

  addSubtask(): void {

    const todo = this.todo;

    if (!todo) {
      return;
    }

    todo.subItems.push(this.createEmptySubtask());

    this.updateState();

  }

  removeSubtask(index: number): void {

    const todo = this.todo;

    if (!todo) {
      return;
    }

    todo.subItems.splice(index, 1);

    this.recalculateOrder();

    this.updateState();

  }

  hasInvalidSubtasks(): boolean {

    return !!this.todo?.subItems.some(
      x => !x.description.trim()
    );

  }

  breakDown(): void {

    const todo = this.todo;

    if (!todo) {
      return;
    }

    this.state.set(MachineState.BreakingDown);

    this.service
      .breakdown(todo.id)
      .subscribe({
        next: () => {
          this.load();
          this.refreshRequested.emit();
          this.snack.success('Subtasks generated');},
        error: () => {
          this.state.set(MachineState.Ready);
        }
      });
  }

  hasSubtasks(): boolean {
    return (this.todo?.subItems.length ?? 0) > 0;
  }

  private recalculateOrder(): void {

    this.todo!.subItems.forEach((x, i) => {
      x.order = i + 1;
    });

  }

  private finishLoading(): void {
    this.state.set(MachineState.Ready);
    this.cdr.detectChanges();
  }

  private finishSaving(): void {
    this.state.set(MachineState.Ready);
    this.cdr.detectChanges();
  }

  private createEmptySubtask(): TodoItem['subItems'][number] {
    return {
      id: '00000000-0000-0000-0000-000000000000',
      todoItemId: this.todo!.id,
      order: this.todo!.subItems.length + 1,
      description: '',
      isCompleted: false,
      completedAt: null,
      createdAt: null
    };
  }
}