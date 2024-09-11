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

const FILTER_DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MatTableModule, ClearableInputComponent, CommonModule],
  template: ` <app-clearable-input
      label="Filter"
      (valueChange)="onFilterValueChange($event)"
    />
    <table mat-table [dataSource]="dataSource$">
      <!-- Position Column -->
      <ng-container matColumnDef="number">
        <th mat-header-cell *matHeaderCellDef>Number</th>
        <td mat-cell *matCellDef="let element">{{ element.number }}</td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <!-- Symbol Column -->
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let element">{{ element.symbol }}</td>
      </ng-container>

      <!-- Weight Column -->
      <ng-container matColumnDef="atomic_mass">
        <th mat-header-cell *matHeaderCellDef>Atomic mass</th>
        <td mat-cell *matCellDef="let element">{{ element.atomic_mass }}</td>
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
      if (filterValue) {
        return elements.filter((element) =>
          element.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
      return elements;
    })
  );

  protected onFilterValueChange(value: string) {
    this.filterValue$.next(value);
  }
}
