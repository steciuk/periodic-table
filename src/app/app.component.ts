import { Component, inject } from '@angular/core';
import { ElementsTableComponent } from './components/elements-table.component';
import { ElementsService } from './services/elements.service';
import { ClearableInputComponent } from './components/clearable-input.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ElementsGridComponent } from './components/elements-grid.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterService } from './services/filter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ElementsTableComponent,
    ClearableInputComponent,
    MatTabsModule,
    ElementsGridComponent,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `<div class="flex min-h-screen flex-col">
    <header class="mb-8 flex flex-wrap justify-between gap-4 px-4 pt-4">
      <h1 class="m-0">Periodic Table</h1>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button
          mat-stroked-button
          matTooltip="Reverts all changes made to the elements data, i.e. their names, symbols, weights, etc."
          (click)="onDiscardChanges()"
          [disabled]="(areChanges$ | async) === false"
        >
          Revert all changes
        </button>
        <app-clearable-input
          label="Filter"
          (valueChange)="onFilterValueChange($event)"
        />
      </div>
    </header>
    <main class="flex-grow px-4">
      <mat-tab-group dynamicHeight>
        <mat-tab label="Grid">
          <app-elements-grid />
        </mat-tab>
        <mat-tab label="Table">
          <app-elements-table />
        </mat-tab>
      </mat-tab-group>
    </main>
    <footer class="mt-8 pb-4 text-center text-gray-500">
      <span>Made by </span>
      <a href="https://steciuk.dev/" target="_blank" rel="noopener"
        >Adam Steciuk</a
      >
    </footer>
  </div>`,
})
export class AppComponent {
  private readonly elementsService = inject(ElementsService);
  private readonly filterService = inject(FilterService);

  protected readonly areChanges$ = this.elementsService.areChanges$;

  protected onFilterValueChange(value: string) {
    this.filterService.setFilter(value);
  }

  protected onDiscardChanges() {
    this.elementsService.discardChanges();
  }
}
