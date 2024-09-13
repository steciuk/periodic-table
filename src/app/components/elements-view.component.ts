import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  Input,
} from '@angular/core';
import { BaseComponent } from './base.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ElementsService } from '../services/elements.service';
import { FindMatchesService } from '../services/find-matches.service';
import { PeriodicElement } from '../types/PeriodicElement';
import { FilterMatches } from '../types/utils';
import { ElementDialogComponent } from './element-dialog.component';

type PeriodicElementWIthMatches = {
  element: PeriodicElement;
  filterMatches: FilterMatches<PeriodicElement>;
};

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class ElementsViewComponent extends BaseComponent {
  @Input() filterValue$?: Observable<string>;

  protected readonly elementsService = inject(ElementsService);
  protected readonly findMatchesService = inject(FindMatchesService);
  protected readonly dialog = inject(MatDialog);
  protected readonly injector = inject(Injector);
  protected readonly cdr = inject(ChangeDetectorRef);

  protected abstract readonly USED_KEYS: (keyof PeriodicElement)[];

  protected isLoading = true;
  protected elementsWithMatches: PeriodicElementWIthMatches[] = [];

  protected updateElements(
    elementsWithMatches: PeriodicElementWIthMatches[],
  ): void {
    this.elementsWithMatches = elementsWithMatches;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  protected openDialog(element: PeriodicElement): void {
    this.dialog.open(ElementDialogComponent, {
      data: element,
      injector: this.injector,
    });
  }
}
