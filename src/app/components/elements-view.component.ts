import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
} from '@angular/core';
import { combineLatestWith, debounceTime, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ElementsService } from '../services/elements.service';
import { PeriodicElement } from '../types/PeriodicElement';
import { FilterMatches } from '../types/utils';
import { ElementDialogComponent } from './element-dialog.component';
import { FilterService } from '../services/filter.service';

export type PeriodicElementWIthMatches = {
  element: PeriodicElement;
  filterMatches: FilterMatches<PeriodicElement>;
};

const FILTER_DEBOUNCE_TIME = 2000;

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class ElementsViewComponent {
  private readonly elementsService = inject(ElementsService);
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);
  protected readonly filterService = inject(FilterService);

  protected readonly filteredValue$ = this.filterService.getFilterValue$().pipe(
    // Filter after 2 seconds of inactivity
    debounceTime(FILTER_DEBOUNCE_TIME),
    // Do not wait for the first value
    startWith(''),
  );

  protected readonly elementsWithFilter$ = this.elementsService
    .getAll$()
    .pipe(combineLatestWith(this.filteredValue$));

  protected openDialog(element: PeriodicElement): void {
    this.dialog.open(ElementDialogComponent, {
      data: element,
      injector: this.injector,
    });
  }
}
