import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  firstValueFrom
} from 'rxjs';

import {
  activityIcon
} from '../../../../core/utils/activity-icon.utils';

import {
  formatActivity
} from '../../../../core/utils/activity-format.utils';
import { TaskActivity } from './models/task.model';
import { TaskService } from './services/task.service';
import { TaskActivityType } from '../../../../core/enums/activity-type.enum';

@Component({
  selector: 'app-task-activity',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './task-activity.html',
  styleUrls: ['./task-activity.scss']
})
export class TaskActivityComponent
implements OnChanges {

  private service =
    inject(TaskService);

  @Input({ required: true })
  taskId!: string;

  readonly activities =
    signal<TaskActivity[]>([]);

  readonly loading =
    signal(false);

  async ngOnChanges(
    changes: SimpleChanges
  ): Promise<void> {

    if (!changes['taskId']) {
      return;
    }

    if (!this.taskId) {
      return;
    }

    await this.load();

  }

  async refresh(): Promise<void> {

    await this.load();

  }

  private async load(): Promise<void> {

    this.loading.set(true);

    try {

      const result =
        await firstValueFrom(
          this.service.getActivities(
            this.taskId
          )
        );

      this.activities.set(
        result.activities
      );

    }
    finally {

      this.loading.set(false);

    }

  }

  format(type: TaskActivityType): string 
  {
    return formatActivity(type);
  }

  icon(type: TaskActivityType): string 
  {
    return activityIcon(type);
  }

  trackById(index: number, item: TaskActivity): string 
  {
    return item.id;
  }
}