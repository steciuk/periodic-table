import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { combineLatestWith, map, Observable } from 'rxjs';
import { PeriodicElement } from '../types/PeriodicElement';
import { ElementsService } from '../services/elements.service';
import { FindMatchesService } from '../services/find-matches.service';
import { FilterMatches } from '../types/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-elements-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="main-grid">
      @for (elementWithMatches of elementsWithMatches$ | async; track
      elementWithMatches.element.id) { @let element =
      elementWithMatches.element;
      <div
        class="border border-slate-800 text-xs border-solid"
        [ngStyle]="{
          gridColumn: element.xpos,
          gridRow: element.ypos
        }"
      >
        {{ element.name }}
      </div>
      }
    </div>
  `,
  styles: `
  .main-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(18, minmax(0, 1fr));
    grid-template-rows: repeat(10, 80px);
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsGridComponent implements OnInit {
  @Input() filterValue$?: Observable<string>;
  private readonly elementsService = inject(ElementsService);
  private readonly findMatchesService = inject(FindMatchesService);

  private readonly searchKeys = [
    'number',
    'name',
    'symbol',
    'atomic_mass',
  ] as const satisfies (keyof PeriodicElement)[];

  protected elementsWithMatches$: Observable<
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
      this.elementsWithMatches$ = this.elementsService.getAll$().pipe(
        combineLatestWith(this.filterValue$),
        map(([elements, filterValue]) => {
          return elements.map((element) => ({
            element,
            filterMatches: this.findMatchesService.findMatches(
              element,
              this.searchKeys,
              filterValue
            ),
          }));
        })
      );
    }
  }
}
