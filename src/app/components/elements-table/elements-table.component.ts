import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ElementsService } from '../../services/elements.service';
import { PeriodicElement } from '../../types/PeriodicElement';
import { combineLatestWith, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ElementsTableCellContentComponent } from './elements-table-cell.component';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from '../element-dialog.component';
import { FindMatchesService } from '../../services/find-matches.service';
import { FilterMatches } from '../../types/utils';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MatTableModule, CommonModule, ElementsTableCellContentComponent],
  template: ` <mat-table [dataSource]="dataSource$">
    <ng-container matColumnDef="number">
      <mat-header-cell *matHeaderCellDef>Number</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-elements-table-cell-content
          [value]="elementWithMatches.element.number"
          [filterMatch]="elementWithMatches.filterMatches.number"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="name">
      <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-elements-table-cell-content
          [value]="elementWithMatches.element.name"
          [filterMatch]="elementWithMatches.filterMatches.name"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="symbol">
      <mat-header-cell *matHeaderCellDef>Symbol</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-elements-table-cell-content
          [value]="elementWithMatches.element.symbol"
          [filterMatch]="elementWithMatches.filterMatches.symbol"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="phase">
      <mat-header-cell *matHeaderCellDef>Phase</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-elements-table-cell-content
          [value]="elementWithMatches.element.phase"
          [filterMatch]="elementWithMatches.filterMatches.phase"
        />
      </mat-cell>
    </ng-container>

    <ng-container matColumnDef="atomic_mass">
      <mat-header-cell *matHeaderCellDef>Atomic mass</mat-header-cell>
      <mat-cell *matCellDef="let elementWithMatches">
        <app-elements-table-cell-content
          [value]="elementWithMatches.element.atomic_mass"
          [filterMatch]="elementWithMatches.filterMatches.atomic_mass"
        />
      </mat-cell>
    </ng-container>

    <mat-header-row *matHeaderRowDef="displayedColumns" />
    <mat-row
      *matRowDef="let row; columns: displayedColumns"
      (click)="onRowClick(row.element)"
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

  protected readonly displayedColumns = [
    'number',
    'name',
    'symbol',
    'phase',
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
        elements.map((element) => ({ element, filterMatches: {} }))
      )
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
              this.displayedColumns,
              filterValue
            ),
          }));

          return filterValue === ''
            ? elementsWithMatches
            : elementsWithMatches.filter(
                (elementWithMatches) =>
                  Object.keys(elementWithMatches.filterMatches).length > 0
              );
        })
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
