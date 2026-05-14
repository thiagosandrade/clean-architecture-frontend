import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { formatDateTime } from '../../core/utils/date-format.utils';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user?: User;
  formatDateTime = formatDateTime;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('id');

    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    this.userService.getById(userId).subscribe({
      next: (res) => this.user = res,
      error: (err) => console.error('Failed to load user', err)
    });
  }
}