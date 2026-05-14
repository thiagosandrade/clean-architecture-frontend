import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { USER_TABLE_CONFIG } from './config/user-table.config';
import { DataTableComponent } from '../../core/components/ui/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../core/services/snackbar.service';
import { User } from './models/user.model';

@Component({
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  tableConfig = USER_TABLE_CONFIG;

  constructor(
      private service: UserService,
      private snack: SnackbarService
    ) {}
  
    ngOnInit() {
      this.load();
    }
  
    load() {
      this.service.getAll().subscribe(res => this.users = res);
    }
  
    handleAction(event: { action: string, row: User }) {
      if (event.action === 'delete') {
        this.service.delete(event.row.id).subscribe(() => {
          this.snack.success('User deleted');
          this.load();
        });
      }
}
}