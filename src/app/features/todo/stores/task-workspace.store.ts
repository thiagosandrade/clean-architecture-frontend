import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { TaskItem } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Injectable({ providedIn: 'root' })
export class TaskWorkspaceStore {

  constructor(
    private readonly todoService: TodoService
  ) {}

  private readonly _loading =
    signal(false);

  private readonly _task =
    signal<TaskItem | null>(null);

  readonly loading =
    computed(() => this._loading());

  readonly task =
    computed(() => this._task());

  readonly taskId =
    computed(() => this._task()?.id ?? '');

  async load(id: string): Promise<void> {

    this._loading.set(true);

    try {

      const task =
        await firstValueFrom(
          this.todoService.getById(id)
        );

      this._task.set(task);

    }
    finally {

      this._loading.set(false);

    }

  }

  async refresh(): Promise<void> {

    const id =
      this.taskId();

    if (!id) {
      return;
    }

    await this.load(id);

  }

  setTask(task: TaskItem): void {

    this._task.set(task);

  }

  patchTask(
    patch: Partial<TaskItem>
  ): void {

    const current =
      this._task();

    if (!current) {
      return;
    }

    this._task.set({

      ...current,

      ...patch

    });

  }

}