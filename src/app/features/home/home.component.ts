import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todos/services/todo.service';
import { TodoItem } from '../todos/models/todo.model';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { TaskSummaryComponent } from './components/task-summary/task-summary.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoDetailsDialogComponent } from '../todos/todo-details-dialog/todo-details-dialog';
import { OverviewComponent } from "./components/overview/overview.component";
import { AssistantService } from './services/assistant.service';

interface HomeQuery {
  type: 'today' | 'this week' | 'search' | 'high priority' | 'next work' | 'overdue' ;
  prompt?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    TaskSummaryComponent,
    OverviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private dialog = inject(MatDialog);

  question = '';
  assistantMessage = '';
  emptyMessage = '';
  hasSearched = false;

  currentQuery: HomeQuery = {
    type: 'today'
  };

  suggestions = [
    'Show my tasks due today',
    'Show this week tasks',
    'Show high priority tasks',
    'What should I work on next?',
    'Show overdue tasks',
    'Plan my day'
  ];

  tasks: TodoItem[] = [];
  loading: boolean = false;

  constructor(private assistantService: AssistantService) { }

  ask() {

    const text = this.question.toLowerCase();
    this.hasSearched = false;
    this.emptyMessage = '';
    this.assistantMessage = '';

    this.currentQuery = {
      type: 'search',
      prompt: this.question
    };

    if (text.includes('today')) {
      this.loadTodayTasks();
    }
    else if (text.includes('high priority')) {
      this.getHighPriorityTasks();
    }
    else if (text.includes('show overdue tasks')) {
      this.getOverdueTasks();
    }
    else if (text.includes('what should i work on next')) {
      this.getNextWorkTasks();
    }
    else if (text.includes('this week')) {
      this.getThisWeekTasks();
    }
  }


  select(text: string) {

    this.question = text;

  }

  loadTodayTasks() {

    this.loading = true;

    this.currentQuery = {
      type: 'today'
    };

    this.assistantService.getTasksForToday()
      .subscribe({

        next: (response) => {

          this.tasks = response.items;

          if (this.tasks.length === 0) {
              this.emptyMessage = `You don't have any ${this.question.toLowerCase().replace('show ', '')}.`;
          }
          else {
              this.emptyMessage = '';
              this.assistantMessage = `You have ${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'} due today.`;
          }

          this.loading = false;
          this.hasSearched = true;
        },

        error: () => {

          this.loading = false;
          this.hasSearched = true;

        }

      });

  }

  getHighPriorityTasks() {

    this.loading = true;

    this.currentQuery = {
      type: 'high priority'
    };

    this.assistantService.getHighPriorityTasks()
      .subscribe({

        next: (response) => {

          this.tasks = response.items;
          if (this.tasks.length === 0) {
              this.emptyMessage =
                  `You don't have any ${this.question.toLowerCase().replace('show ', '')}.`;
          }
          else {
              this.emptyMessage = '';
              this.assistantMessage = `You have ${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'} with high priority.`;
          }
          

          this.loading = false;
          this.hasSearched = true;

        },

        error: () => {

          this.loading = false;
          this.hasSearched = true;

        }

      });

  }

  getNextWorkTasks() {

    this.loading = true;

    this.currentQuery = {
      type: 'next work'
    };

    this.assistantService.getNextWorkTasks()
      .subscribe({

        next: (response) => {

          this.tasks = response.items;
          if (this.tasks.length === 0) {
              this.emptyMessage = `You don't have any ${this.question.toLowerCase().replace('show ', '')} tasks.`;
          }
          else {
              this.emptyMessage = '';
              this.assistantMessage = `You have ${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'} ordered by priority so you can start working on them.`;
          }
          

          this.loading = false;
          this.hasSearched = true;

        },

        error: () => {

          this.loading = false;
          this.hasSearched = true;

        }

      });

  }

  getOverdueTasks() {

    this.loading = true;

    this.currentQuery = {
      type: 'overdue'
    };

    this.assistantService.getOverdueTasks()
      .subscribe({

        next: (response) => {

          this.tasks = response.items;
          if (this.tasks.length === 0) {
              this.emptyMessage = `You don't have any ${this.question.toLowerCase().replace('show ', '')} tasks.`;
          }
          else {
              this.emptyMessage = '';
              this.assistantMessage = `You have ${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'} overdue tasks.`;
          }
          

          this.loading = false;
          this.hasSearched = true;

        },

        error: () => {

          this.loading = false;
          this.hasSearched = true;

        }

      });

  }

  getThisWeekTasks() {

    this.loading = true;

    this.currentQuery = {
      type: 'this week'
    };

    this.assistantService.getTasksForThisWeek()
      .subscribe({

        next: (response) => {

          this.tasks = response.items;
          if (this.tasks.length === 0) {
              this.emptyMessage = `You don't have any ${this.question.toLowerCase().replace('show ', '')} tasks.`;
          }
          else {
              this.emptyMessage = '';
              this.assistantMessage = `You have ${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'} for this week.`;
          }
          

          this.loading = false;
          this.hasSearched = true;

        },

        error: () => {

          this.loading = false;
          this.hasSearched = true;

        }

      });

  }

  refreshCurrentView() {

    switch (this.currentQuery.type) {

      case 'today':

        this.loadTodayTasks();

        break;

      case 'high priority':

        this.getHighPriorityTasks();

        break;

      case 'next work':

        this.getNextWorkTasks();

        break;

      case 'search':

        // TODO:
        // Later this will call the AI endpoint again.
        // For now you could just call loadTodayTasks()
        // or do nothing.

        break;

    }

  }

  get greeting(): string {

    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 18) {
      return 'Good afternoon';
    }

    return 'Good evening';

  }

  openTodo(todo: TodoItem): void {

    const dialogRef = this.dialog.open(
      TodoDetailsDialogComponent,
      {
        width: '900px',
        maxWidth: '95vw',
        height: 'auto',
        maxHeight: '90vh',
        data: {
          id: todo.id
        }
      }
    );

    dialogRef.afterClosed().subscribe(refresh => {

      if (refresh) {
        this.refreshCurrentView();
      }

    });
  }


}