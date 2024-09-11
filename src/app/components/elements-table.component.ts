import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BaseComponent } from './base.component';
import { ElementsService } from '../services/elements.service';
import { PeriodicElement } from '../types/PeriodicElement';
import { ClearableInputComponent } from './clearable-input.component';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  map,
  startWith,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ElementsTableCellContentComponent,
  SimpleValueOrWithMatches,
} from './elements-table-cell.component';

const FILTER_DEBOUNCE_TIME = 2000;

type PeriodicElementWithMatches = {
  [key in keyof PeriodicElement]: SimpleValueOrWithMatches;
};

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
    <table mat-table [dataSource]="dataSource$">
      <ng-container matColumnDef="number">
        <th mat-header-cell *matHeaderCellDef>Number</th>
        <td mat-cell *matCellDef="let element">
          <app-elements-table-cell-content [elementValue]="element.number" />
        </td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">
          <app-elements-table-cell-content [elementValue]="element.name" />
        </td>
      </ng-container>

      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let element">
          <app-elements-table-cell-content [elementValue]="element.symbol" />
        </td>
      </ng-container>

      <ng-container matColumnDef="phase">
        <th mat-header-cell *matHeaderCellDef>Phase</th>
        <td mat-cell *matCellDef="let element">
          <app-elements-table-cell-content [elementValue]="element.phase" />
        </td>
      </ng-container>

      <ng-container matColumnDef="atomic_mass">
        <th mat-header-cell *matHeaderCellDef>Atomic mass</th>
        <td mat-cell *matCellDef="let element">
          <app-elements-table-cell-content
            [elementValue]="element.atomic_mass"
          />
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableComponent extends BaseComponent {
  private readonly elementsService = inject(ElementsService);

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
        .map((element) => {
          if (!filterValue) return element;

          let matchesFilter = false;
          const elementWithMatches: PeriodicElementWithMatches = { ...element };

          for (const key of this.displayedColumns) {
            const value = element[key]?.toString();
            if (!value) continue;

            const startIndex = value
              .toLowerCase()
              .indexOf(filterValue.toLowerCase());
            if (startIndex !== -1) {
              elementWithMatches[key] = {
                value,
                startIndex,
                endIndex: startIndex + filterValue.length,
              };
              matchesFilter = true;
            }
          }

          return matchesFilter ? elementWithMatches : null;
        })
        .filter((element) => element !== null);
    })
  );

  protected onFilterValueChange(value: string) {
    this.filterValue$.next(value);
  }
}
