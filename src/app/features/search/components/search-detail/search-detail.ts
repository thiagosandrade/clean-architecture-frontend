import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { SearchDetailLink, SearchDetailResponse } from "../../models/search-detail.model";
import { SearchService } from "../../services/search.service";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { formatDateOnly } from "../../../../core/utils/date-format.utils";
import { MatDialog } from "@angular/material/dialog";
import { TodoService } from "../../../todo/services/todo.service";
import { TodoWorkspaceDialogComponent } from "../../../todo/dialogs/todo-workspace-dialog/todo-workspace-dialog";
import { formatPriority } from "../../../../core/utils/priority-format.utils";
import { SearchDetailAttachment } from "../search-detail-attachment/search-detail-attachment";
import { SubtaskSummaryComponent } from "../search-detail-subtask/search-detail-subtask";
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-search-detail',
  standalone: true,
  templateUrl: './search-detail.html',
  styleUrls: ['./search-detail.scss'],
  imports: [MatIconModule, MatProgressSpinnerModule, MatDividerModule, SearchDetailAttachment, SubtaskSummaryComponent, MatAnchor]
})
export class SearchDetailComponent implements OnInit {

  formatDateOnly = formatDateOnly

  private route = inject(ActivatedRoute);

  private searchService = inject(SearchService);

  private dialog = inject(MatDialog);

  private todoService = inject(TodoService);

  private router = inject(Router)

  readonly detail =
    signal<SearchDetailResponse | null>(null);


  readonly loading =
    signal(true);



  async ngOnInit() {

     this.route.paramMap
    .subscribe(async params => {

      const type = params.get('type');
      const id = params.get('id');

      if (type && id) {

        const result =
          await firstValueFrom(
            this.searchService.getDetail(type, id)
        );

        this.detail.set(result);

        this.loading.set(false);

      }

    });

  }

  get breadcrumbs(): string[] {

    const item = this.detail();

    if (!item) {
      return [];
    }

    return [
      'Search',
      this.capitalize(item.type),
      item.title
    ];

  }


  private capitalize(value: string): string {

    return value.charAt(0).toUpperCase()
      + value.slice(1);

  }

  openWorkspace(id: string): void {

    this.todoService.getById(id)
      .subscribe(todo => {

        this.dialog.open(
          TodoWorkspaceDialogComponent,
          {
            width: '90vw',
            maxWidth: '1400px',
            height: 'auto',
            maxHeight: '100vh',
            data: {
              todo
            }
          }
        );

      });

  }

  openRelated(
    link: SearchDetailLink
  ): void {

    this.router.navigate([
      '/search/detail',
      link.type,
      link.id
    ]);

  }

  objectEntries(value: any): [string, any][] {
    return Object.entries(value ?? {});
  }

  isPrimitive(value: any): boolean {

    return value === null ||
      typeof value !== 'object';

  }


  formatValue(value: any): string {

    if (!value) {
      return '-';
    }


    if (Array.isArray(value)) {

      return value
        .map(x =>
          typeof x === 'object'
            ? x.description ?? JSON.stringify(x)
            : x
        )
        .join(', ');

    }

    if (typeof value === 'object') {

      return JSON.stringify(value);

    }

    return String(value);

  }

  isObject(value: unknown): boolean {

    return value !== null &&
      typeof value === 'object';

  }

  formatProperty(
    key: string,
    value: unknown
  ): string {

    if (value === null || value === undefined) {
      return '-';
    }

    switch (key) {

      case 'dueDate':

        return formatDateOnly(
          value as string
        );


      case 'priority':

        return formatPriority(
          value as string
        );


      case 'isCompleted':

        return value
          ? 'Completed'
          : 'Pending';


      case 'createdOn':

      case 'updatedOn':

        return formatDateOnly(
          value as string
        );


      default:

        return this.formatValue(value);

    }

  }
}