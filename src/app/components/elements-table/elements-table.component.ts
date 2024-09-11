import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BaseComponent } from '../base.component';
import { ElementsService } from '../../services/elements.service';
import { PeriodicElement } from '../../types/PeriodicElement';
import { ClearableInputComponent } from '../clearable-input.component';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  map,
  startWith,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ElementsTableCellContentComponent } from './elements-table-cell.component';
import { PeriodicElementFilterMatches } from './types';
import { MatDialog } from '@angular/material/dialog';
import { ElementDetailsDialogComponent } from '../element-details-dialog.component';

const FILTER_DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    MatTableModule,
    ClearableInputComponent,
    CommonModule,
    ElementsTableCellContentComponent,
  ],
  template: ` <app-clearable-input
      label="Filter"
      (valueChange)="onFilterValueChange($event)"
    />
    <mat-table [dataSource]="dataSource$">
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
export class ElementsTableComponent extends BaseComponent {
  private readonly elementsService = inject(ElementsService);
  private readonly dialog = inject(MatDialog);

  protected readonly filterValue$ = new BehaviorSubject('');
  protected readonly displayedColumns: (keyof PeriodicElement)[] = [
    'number',
    'name',
    'symbol',
    'phase',
    'atomic_mass',
  ];
  protected readonly dataSource$ = this.elementsService.get$().pipe(
    combineLatestWith(
      this.filterValue$.pipe(
        debounceTime(FILTER_DEBOUNCE_TIME),
        // Do not wait for the first value to start filtering
        startWith('')
      )
    ),
    map(([elements, filterValue]) => {
      return elements
        .map(
          (
            element
          ): {
            element: PeriodicElement;
            filterMatches: PeriodicElementFilterMatches;
          } | null => {
            if (!filterValue) return { element, filterMatches: {} };

            let matchesFilter = false;
            const filterMatches: PeriodicElementFilterMatches = {};

            for (const key of this.displayedColumns) {
              const stringValue = element[key]?.toString();
              if (!stringValue) continue;

              const startIndex = stringValue
                .toLowerCase()
                .indexOf(filterValue.toLowerCase());
              if (startIndex !== -1) {
                filterMatches[key] = {
                  stringValue,
                  startIndex,
                  endIndex: startIndex + filterValue.length,
                };
                matchesFilter = true;
              }
            }

            return matchesFilter ? { element, filterMatches } : null;
          }
        )
        .filter((elementWithMatches) => elementWithMatches !== null);
    })
  );

  protected onFilterValueChange(value: string) {
    this.filterValue$.next(value);
  }

  protected onRowClick(element: PeriodicElement) {
    this.dialog.open(ElementDetailsDialogComponent, {
      data: element,
    });
  }
}
