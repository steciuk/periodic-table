import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../types/PeriodicElement';
import { combineLatestWith, map, Observable } from 'rxjs';
import { ElementMarkValueMatchComponent } from './element-mark-value-match.component';
import { LoadingComponent } from './loading.component';
import {
  ElementsViewComponent,
  PeriodicElementWIthMatches as PeriodicElementWithMatches,
} from './elements-view.component';
import { FindMatchesService } from '../services/find-matches.service';
import { RxLet } from '@rx-angular/template/let';
import { MatSortModule, Sort } from '@angular/material/sort';
import { rxState } from '@rx-angular/state';

export type SortState = {
  active: keyof PeriodicElement;
  direction: 'asc' | 'desc';
};

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    MatTableModule,
    ElementMarkValueMatchComponent,
    LoadingComponent,
    RxLet,
    MatSortModule,
  ],
  host: { class: 'block overflow-x-auto' },
  template: `
    <ng-container
      *rxLet="elementsWithMatches$; let elementsWithMatches; suspense: loading"
    >
      <mat-table
        [dataSource]="elementsWithMatches"
        matSort
        (matSortChange)="onSortChange($event)"
        class="min-w-[650px]"
      >
        <ng-container matColumnDef="number">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by number"
            >Number</mat-header-cell
          >
          <mat-cell *matCellDef="let elementWithMatches">
            <app-element-mark-value-match
              [value]="elementWithMatches.element.number"
              [filterMatch]="elementWithMatches.filterMatches.number"
            />
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="name">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by name"
            >Name</mat-header-cell
          >
          <mat-cell *matCellDef="let elementWithMatches">
            <app-element-mark-value-match
              [value]="elementWithMatches.element.name"
              [filterMatch]="elementWithMatches.filterMatches.name"
            />
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="symbol">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by symbol"
            >Symbol</mat-header-cell
          >
          <mat-cell *matCellDef="let elementWithMatches">
            <app-element-mark-value-match
              [value]="elementWithMatches.element.symbol"
              [filterMatch]="elementWithMatches.filterMatches.symbol"
            />
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="category">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by category"
            >Category</mat-header-cell
          >
          <mat-cell *matCellDef="let elementWithMatches">
            <app-element-mark-value-match
              [value]="elementWithMatches.element.category"
              [filterMatch]="elementWithMatches.filterMatches.category"
            />
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="phase">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by phase"
            >Phase</mat-header-cell
          >
          <mat-cell *matCellDef="let elementWithMatches">
            <app-element-mark-value-match
              [value]="elementWithMatches.element.phase"
              [filterMatch]="elementWithMatches.filterMatches.phase"
            />
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="atomic_mass">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by atomic mass"
            >Atomic mass</mat-header-cell
          >
          <mat-cell *matCellDef="let elementWithMatches">
            <app-element-mark-value-match
              [value]="elementWithMatches.element.atomic_mass"
              [filterMatch]="elementWithMatches.filterMatches.atomic_mass"
            />
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="USED_KEYS" />
        <mat-row
          *matRowDef="let row; columns: USED_KEYS"
          (click)="openDialog(row.element)"
          [ariaLabel]="row.element.name"
          class="cursor-pointer"
        />
      </mat-table>
    </ng-container>

    <ng-template #loading>
      <app-loading />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableComponent extends ElementsViewComponent {
  private readonly findMatchesService = inject(FindMatchesService);

  private readonly state = rxState<{
    sorting: SortState | null;
  }>(({ set }) => set({ sorting: null }));

  protected readonly USED_KEYS = [
    'number',
    'name',
    'symbol',
    'phase',
    'category',
    'atomic_mass',
  ] as const satisfies (keyof PeriodicElement)[];

  protected readonly elementsWithMatches$: Observable<
    PeriodicElementWithMatches[]
  > = this.elementsWithFilter$.pipe(
    map(([elements, filterValue]) => {
      const elementsWithMatches = elements.map((element) => ({
        element,
        filterMatches: this.findMatchesService.findMatches(
          element,
          this.USED_KEYS,
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
    combineLatestWith(this.state.select('sorting')),
    map(([elementsWithMatches, sorting]) => {
      if (!sorting) {
        return elementsWithMatches;
      }

      return this.sortElementsWithMatches(elementsWithMatches, sorting);
    }),
  );

  protected onSortChange($event: Sort) {
    if ($event.direction === '') {
      this.state.set({ sorting: null });
    } else {
      this.state.set({ sorting: $event as SortState });
    }
  }

  private sortElementsWithMatches(
    elementsWithMatches: PeriodicElementWithMatches[],
    sorting: SortState,
  ): PeriodicElementWithMatches[] {
    const { active, direction } = sorting;

    return elementsWithMatches.slice().sort((a, b) => {
      const valueA = a.element[active];
      const valueB = b.element[active];

      if (
        valueA === null ||
        valueB === null ||
        valueA === undefined ||
        valueB === undefined
      ) {
        if (
          (valueA === null || valueA === undefined) &&
          (valueB === null || valueB === undefined)
        ) {
          return 0;
        }

        if (valueA === null || valueA === undefined) {
          return direction === 'asc' ? -1 : 1;
        }

        return direction === 'asc' ? 1 : -1;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }
}
