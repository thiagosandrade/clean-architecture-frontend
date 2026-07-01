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
import { Priority } from '../../core/enums/priority.enum';

interface HomeQuery {
  type: 'today' | 'search';
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
  
  currentQuery: HomeQuery = {
    type: 'today'
  };

  suggestions = [
    'Plan my day',
    'Show my tasks due today',
    'Show high priority tasks',
    'What should I work on next?',
    'Show overdue tasks',
    'Show this week tasks'
  ];

  tasks: TodoItem[] = [];
  loading: boolean = false;

  constructor(private todoService: TodoService) { }



  ask() {

    const text = this.question.toLowerCase();
    
    this.currentQuery = {
      type: 'search',
      prompt: this.question
    };
    
    if (text.includes('today')) {

      this.loadTodayTasks();

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

    const today = new Date();

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );


    this.todoService
      .getAll(
        1,
        20,
        'dueDate',
        false
      )
      .subscribe({

        next: (response) => {

          this.tasks = response.items;
          this.assistantMessage =  `You have ${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'} due today.`;

          this.loading = false;
        },

        error: () => {

          this.loading = false;

        }

      });

  }

  refreshCurrentView() {

    switch (this.currentQuery.type) {

      case 'today':

        this.loadTodayTasks();

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