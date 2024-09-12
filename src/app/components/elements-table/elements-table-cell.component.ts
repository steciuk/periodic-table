import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../../types/PeriodicElement';
import { FilterMatch } from '../../types/utils';

@Component({
  selector: 'app-elements-table-cell-content',
  standalone: true,
  imports: [MatTableModule],
  template: `
    @if (filterMatch) {
    <span class="flex">
      {{ filterMatch.stringValue.substring(0, filterMatch.startIndex) }}
      <mark>{{
        filterMatch.stringValue.substring(
          filterMatch.startIndex,
          filterMatch.endIndex
        )
      }}</mark>
      {{ filterMatch.stringValue.substring(filterMatch.endIndex) }}
    </span>
    } @else {
    <span>{{ value }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableCellContentComponent {
  @Input({ required: true }) value!: PeriodicElement[keyof PeriodicElement];
  @Input() filterMatch?: FilterMatch;
}
