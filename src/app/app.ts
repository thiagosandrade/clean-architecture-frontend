import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './core/components/layout/toolbar/toolbar.component';
import { ThemeService } from './core/services/theme.service';
import { LoadingService } from './core/services/loading.service';
import { MatProgressBarModule }  from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, MatProgressBarModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements OnInit {
  loadingService = inject(LoadingService);
  
  constructor(private theme: ThemeService) {}

  ngOnInit() {
    this.theme.init();
  }
}
