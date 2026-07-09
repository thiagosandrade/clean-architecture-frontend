import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TodoItem, TodoResponse } from '../todo/models/todo.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

import { TaskSummaryComponent } from './components/task-summary/task-summary.component';
import { MatDialog } from '@angular/material/dialog';
import { OverviewComponent } from './components/overview/overview.component';
import { AssistantService } from './services/assistant.service';
import { AssistantIntent } from '../../core/enums/assistant-intent.enum';
import { IntentClassifierService } from './services/intent-classifier.service';
import { TodoWorkspaceDialogComponent } from '../todo/components/todo-workspace-dialog/todo-workspace-dialog';
import { TodoWorkspaceMatchType } from '../todo/models/todo-workspace-data';

interface HomeQuery {
  type: 'today' | 'this week' | 'search' | 'high priority' | 'next work' | 'overdue';
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
    OverviewComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private dialog = inject(MatDialog);

  question = '';
  assistantMessage = '';
  emptyMessage = '';
  hasSearched = false;
  resultsTitle = '';

  currentQuery: HomeQuery = {
    type: 'today',
  };

  suggestions = [
    'Show my tasks due today',
    'Show this week tasks',
    'Show high priority tasks',
    'What should I work on next?',
    'Show overdue tasks',
    'Plan my day',
  ];

  // raw backend results
  tasks: TodoItem[] = [];

  // UI projections
  relatedTasks: TodoItem[] = [];
  otherTasks: TodoItem[] = [];

  loading: boolean = false;

  constructor(
    private assistantService: AssistantService,
    private classifierService: IntentClassifierService,
  ) {}

  // =========================
  // ENTRY POINT
  // =========================
  ask() {
    this.hasSearched = false;
    this.emptyMessage = '';
    this.assistantMessage = '';
    this.relatedTasks = [];
    this.otherTasks = [];

    const result = this.classifierService.classify(this.question);

    switch (result.intent) {
      case AssistantIntent.Today:
        this.loadTodayTasks();
        break;

      case AssistantIntent.ThisWeek:
        this.getThisWeekTasks();
        break;

      case AssistantIntent.HighPriority:
        this.getHighPriorityTasks();
        break;

      case AssistantIntent.NextWork:
        this.getNextWorkTasks();
        break;

      case AssistantIntent.Overdue:
        this.getOverdueTasks();
        break;

      case AssistantIntent.SemanticSearch:
        this.searchTasks(result.query!);
        break;

      case AssistantIntent.PlanDay:
        break;
    }
  }

  // =========================
  // SEMANTIC SEARCH
  // =========================
  searchTasks(query: string) {
    this.resultsTitle = `Results for "${query}"`;

    this.loading = true;

    this.currentQuery = {
      type: 'search',
      prompt: query,
    };

    this.assistantService.search(query).subscribe({
      next: (response) => {
        this.tasks = response.items;

        this.splitSemanticResults();
        this.buildSemanticMessage(query);

        this.loading = false;
        this.hasSearched = true;
      },
      error: () => {
        this.loading = false;
        this.hasSearched = true;
      },
    });
  }

  private splitSemanticResults(): void {
    this.relatedTasks = [];
    this.otherTasks = [];

    if (!this.tasks.length) return;

    const bestSimilarity = this.tasks[0].similarity;

    const relativeThreshold = bestSimilarity * 0.85;
    const minThreshold = 0.55;

    const threshold = Math.max(relativeThreshold, minThreshold);

    this.relatedTasks = this.tasks.filter((x) => x.similarity >= threshold);
    this.otherTasks = this.tasks.filter((x) => x.similarity < threshold);
  }

  private buildSemanticMessage(query: string): void {
    if (!this.relatedTasks.length) {
      this.emptyMessage = `I couldn't find any tasks related to "${query}".`;
      this.assistantMessage = '';
      return;
    }

    const bestSimilarity = this.relatedTasks[0]?.similarity ?? 0;

    const count = this.relatedTasks.length;

    if (bestSimilarity >= 0.9) {
      this.assistantMessage = `I found ${count} highly relevant task${count === 1 ? '' : 's'} related to "${query}".`;
    } else if (bestSimilarity >= 0.8) {
      this.assistantMessage = `I found ${count} relevant task${count === 1 ? '' : 's'} related to "${query}".`;
    } else if (bestSimilarity >= 0.7) {
      this.assistantMessage = `I found ${count} possibly related task${count === 1 ? '' : 's'} for "${query}".`;
    } else {
      this.assistantMessage = `Here are the closest matches I could find for "${query}".`;
    }

    this.emptyMessage = '';
  }

  // =========================
  // FILTERED QUERIES
  // =========================
  loadTodayTasks() {
    this.resultsTitle = 'Tasks Due Today';

    this.executeQuery(
      this.assistantService.getTasksForToday(),
      'today',
      (count) => `You have ${count} task${count === 1 ? '' : 's'} due today.`,
    );
  }

  getThisWeekTasks() {
    this.resultsTitle = 'Tasks Due This Week';

    this.executeQuery(
      this.assistantService.getTasksForThisWeek(),
      'this week',
      (count) => `You have ${count} task${count === 1 ? '' : 's'} for this week.`,
    );
  }

  getOverdueTasks() {
    this.resultsTitle = 'Overdue Tasks';

    this.executeQuery(
      this.assistantService.getOverdueTasks(),
      'overdue',
      (count) => `You have ${count} overdue task${count === 1 ? '' : 's'}.`,
    );
  }

  getNextWorkTasks() {
    this.resultsTitle = 'Recommended Tasks';

    this.executeQuery(
      this.assistantService.getNextWorkTasks(),
      'next work',
      (count) => `You have ${count} task${count === 1 ? '' : 's'} ready to work on.`,
    );
  }

  getHighPriorityTasks() {
    this.resultsTitle = 'High Priority Tasks';

    this.executeQuery(
      this.assistantService.getHighPriorityTasks(),
      'high priority',
      (count) => `You have ${count} high priority task${count === 1 ? '' : 's'}.`,
    );
  }

  // =========================
  // SHARED EXECUTION
  // =========================
  executeQuery(
    request: Observable<TodoResponse>,
    queryType: HomeQuery['type'],
    successMessage: (count: number) => string,
  ): void {
    this.loading = true;

    this.currentQuery = { type: queryType };

    request.subscribe({
      next: (response) => {
        this.tasks = response.items;

        // IMPORTANT: filtered view still uses semantic structure
        this.relatedTasks = this.tasks;
        this.otherTasks = [];

        const count = this.tasks.length;

        if (!count) {
          this.emptyMessage = `No tasks found for "${this.resultsTitle}".`;
          this.assistantMessage = '';
        } else {
          this.emptyMessage = '';
          this.assistantMessage = successMessage(count);
        }

        this.loading = false;
        this.hasSearched = true;
      },
      error: () => {
        this.loading = false;
        this.hasSearched = true;
      },
    });
  }

  // =========================
  // UI HELPERS
  // =========================
  select(text: string) {
    this.question = text;
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
        if (this.currentQuery.prompt) {
          this.searchTasks(this.currentQuery.prompt);
        }
        break;
    }
  }

  get greeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  openTodo(
    todo: TodoItem,
    matchType: TodoWorkspaceMatchType = 'normal',
    navigation: TodoItem[] = [],
  ): void {
    const dialogRef = this.dialog.open(TodoWorkspaceDialogComponent, {
      width: '90vw',
      maxWidth: '1400px',
      height: 'auto',
      maxHeight: '90vh',
      data: {
        todo: todo,
        isEdit: true,
        origin: 'search',
        matchType: matchType,
        navigation: navigation,
      },
    });

    dialogRef.afterClosed().subscribe((refresh) => {
        this.refreshCurrentView();
    });
  }
}
