import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';import { Router } from '@angular/router';import { firstValueFrom } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard-response.model';
import { DashboardWidgetComponent } from '../dashboard-widget/dashboard-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly dashboard = signal<DashboardResponse | null>(null);

  async ngOnInit(): Promise<void> {
    const userId = localStorage.getItem('userId') ?? '';

    try {
      const response = await firstValueFrom(this.service.getDashboard());
      this.dashboard.set(response);
    } finally {
      this.loading.set(false);
    }
  }
  goToSearch(query: string): void {
    this.router.navigate(['/home'], {
      queryParams: { q: query },
    });
  }}
