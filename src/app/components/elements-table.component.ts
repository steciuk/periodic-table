import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ElementsService } from '../services/elements.service';
import { PeriodicElement } from '../types/PeriodicElement';
import { combineLatestWith, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ElementMarkValueMatchComponent } from './element-mark-value-match.component';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from './element-dialog.component';
import { FindMatchesService } from '../services/find-matches.service';
import { FilterMatches } from '../types/utils';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MatTableModule, CommonModule, ElementMarkValueMatchComponent],
  host: { class: 'block overflow-x-auto' },
  template: ` <mat-table [dataSource]="dataSource$" class="min-w-[650px]">
    <ng-container matColumnDef="number">
      <mat-header-cell *matHeaderCellDef>Number</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-element-mark-value-match
          [value]="elementWithMatches.element.number"
          [filterMatch]="elementWithMatches.filterMatches.number"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="name">
      <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-element-mark-value-match
          [value]="elementWithMatches.element.name"
          [filterMatch]="elementWithMatches.filterMatches.name"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="symbol">
      <mat-header-cell *matHeaderCellDef>Symbol</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-element-mark-value-match
          [value]="elementWithMatches.element.symbol"
          [filterMatch]="elementWithMatches.filterMatches.symbol"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="category">
      <mat-header-cell *matHeaderCellDef>Category</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-element-mark-value-match
          [value]="elementWithMatches.element.category"
          [filterMatch]="elementWithMatches.filterMatches.category"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="phase">
      <mat-header-cell *matHeaderCellDef>Phase</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-element-mark-value-match
          [value]="elementWithMatches.element.phase"
          [filterMatch]="elementWithMatches.filterMatches.phase"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="atomic_mass">
      <mat-header-cell *matHeaderCellDef>Atomic mass</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-element-mark-value-match
          [value]="elementWithMatches.element.atomic_mass"
          [filterMatch]="elementWithMatches.filterMatches.atomic_mass"
        />
      </mat-cell>
    </ng-container>

    <mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS" />
    <mat-row
      *matRowDef="let row; columns: DISPLAYED_COLUMNS"
      (click)="onRowClick(row.element)"
      [ariaLabel]="row.element.name"
      class="cursor-pointer"
    />
  </mat-table>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableComponent implements OnInit {
  @Input() filterValue$?: Observable<string>;

  private readonly elementsService = inject(ElementsService);
  private readonly findMatchesService = inject(FindMatchesService);
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);

  protected readonly DISPLAYED_COLUMNS = [
    'number',
    'name',
    'symbol',
    'phase',
    'category',
    'atomic_mass',
  ] as const satisfies (keyof PeriodicElement)[];

  protected dataSource$: Observable<
    {
      element: PeriodicElement;
      filterMatches: FilterMatches<PeriodicElement>;
    }[]
  > = this.elementsService
    .getAll$()
    .pipe(
      map((elements) =>
        elements.map((element) => ({ element, filterMatches: {} })),
      ),
    );

  ngOnInit(): void {
    if (this.filterValue$ !== undefined) {
      this.dataSource$ = this.elementsService.getAll$().pipe(
        combineLatestWith(this.filterValue$),
        map(([elements, filterValue]) => {
          const elementsWithMatches = elements.map((element) => ({
            element,
            filterMatches: this.findMatchesService.findMatches(
              element,
              this.DISPLAYED_COLUMNS,
              filterValue,
            ),
          }));

          return filterValue === ''
            ? elementsWithMatches
            : elementsWithMatches.filter(
                (elementWithMatches) =>
                  Object.keys(elementWithMatches.filterMatches).length > 0,
              );
        }),
      );
    }
  }

  protected onRowClick(element: PeriodicElement) {
    this.dialog.open(ElementDialogComponent, {
      data: element,
      injector: this.injector,
    });
  }
}
