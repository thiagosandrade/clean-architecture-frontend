import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';


export interface SearchSubtaskSummary {
  id: string;
  description: string;
  isCompleted: boolean;
  taskId?: string;
  taskDescription?: string;
}


@Component({
  selector: 'app-search-detail-subtask',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './search-detail-subtask.html',
  styleUrls: ['./search-detail-subtask.scss']
})
export class SubtaskSummaryComponent {


  @Input({ required: true })
  subtasks!: SearchSubtaskSummary[];


  completedCount(): number {

    return this.subtasks
      .filter(x => x.isCompleted)
      .length;

  }


  openTask(taskId?: string): void {

    if (!taskId) {
      return;
    }

    // Later we can emit this to SearchDetailComponent
    // to navigate to /search/detail/task/:id

    console.log('Open task', taskId);

  }

}