import { MatChip, MatChipSet } from '@angular/material/chips';

import {
  TableAction,
  TableConfig
} from './table-config.model';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipSet,
    MatChip
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> {

  @Input() data: T[] = [];

  @Input() config!: TableConfig<T>;

  @Input() total = 0;

  // when false, paginator is hidden
  @Input() pagination = true;
  
  @Input() pageSize = 10;

  @Input() pageIndex = 0;

  @Output() action = new EventEmitter<{
    action: string,
    row: T
  }>();

  @Output() pageChange =
    new EventEmitter<PageEvent>();

  @Output() sortChange =
    new EventEmitter<Sort>();

  get columnKeys(): string[] {
    return this.config.columns.map(
      c => c.key as string
    );
  }

  onAction(
    action: TableAction<T>,
    row: T
  ) {
    this.action.emit({
      action: action.type,
      row
    });
  }
}