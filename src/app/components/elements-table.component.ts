import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BaseComponent } from './base.component';
import { ElementsService } from '../services/elements.service';
import { CommonModule } from '@angular/common';
import { PeriodicElement } from '../types/PeriodicElement';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  template: ` <table mat-table [dataSource]="dataSource$">
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
  protected dataSource$ = this.elementsService.get$();

  protected displayedColumns: (keyof PeriodicElement)[] = [
    'number',
    'name',
    'symbol',
    'atomic_mass',
  ];
}
