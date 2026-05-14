import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(
  private theme: ThemeService,
  private router: Router
) {}

  goToUser() {
    this.router.navigate(['/user']);
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  goToTodos() {
    this.router.navigate(['/todos']);
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    console.log('logout clicked');
    // later: clear token + redirect
  }
}