import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TableConfig, TableAction } from './table-config.model';
import { MatIconModule } from '@angular/material/icon';
import { MatChip, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipSet, MatChip],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> {

  @Input() data: T[] = [];
  @Input() config!: TableConfig<T>;

  @Output() action = new EventEmitter<{ action: string, row: T }>();

  get columnKeys(): string[] {
    return this.config.columns.map(c => c.key as string);
  }

  onAction(action: TableAction<T>, row: T) {
    this.action.emit({ action: action.type, row });
  }
}