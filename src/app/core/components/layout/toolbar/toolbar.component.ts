import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../services/theme.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { GlobalSearchComponent } from "../../../../features/search/components/global-search/global-search.component";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule, GlobalSearchComponent],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  readonly showHamburger = signal(false);
  private readonly authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  
  constructor(
    private theme: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updateLayout();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateLayout();
  }

  private updateLayout(): void {
    this.showHamburger.set(window.innerWidth <= 768);
  }

  goToUser() {
    this.router.navigate(['/user']);
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  goToTodos() {
    this.router.navigate(['/todos']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToSearch() {
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
