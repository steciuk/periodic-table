import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../types/PeriodicElement';
import { combineLatestWith, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ElementMarkValueMatchComponent } from './element-mark-value-match.component';
import { LoadingComponent } from './loading.component';
import { ElementsViewComponent } from './elements-view.component';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    ElementMarkValueMatchComponent,
    LoadingComponent,
  ],
  host: { class: 'block overflow-x-auto' },
  template: `@if (isLoading) {
      <app-loading />
    } @else {
      <mat-table [dataSource]="elementsWithMatches" class="min-w-[650px]">
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

        <mat-header-row *matHeaderRowDef="USED_KEYS" />
        <mat-row
          *matRowDef="let row; columns: USED_KEYS"
          (click)="openDialog(row.element)"
          [ariaLabel]="row.element.name"
          class="cursor-pointer"
        />
      </mat-table>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableComponent
  extends ElementsViewComponent
  implements OnInit
{
  protected readonly USED_KEYS = [
    'number',
    'name',
    'symbol',
    'phase',
    'category',
    'atomic_mass',
  ] as const satisfies (keyof PeriodicElement)[];

  ngOnInit(): void {
    if (this.filterValue$ === undefined) {
      this.subs.sink = this.elementsService
        .getAll$()
        .pipe(
          map((elements) =>
            elements.map((element) => ({ element, filterMatches: {} })),
          ),
        )
        .subscribe((elementsWithMatches) => {
          this.updateElements(elementsWithMatches);
        });
    } else {
      this.subs.sink = this.elementsService
        .getAll$()
        .pipe(
          combineLatestWith(this.filterValue$),
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
        )
        .subscribe((elementsWithMatches) => {
          this.updateElements(elementsWithMatches);
        });
    }
  }
}
