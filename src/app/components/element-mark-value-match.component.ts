import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PeriodicElement } from '../types/PeriodicElement';
import { FilterMatch } from '../types/utils';

@Component({
  selector: 'app-element-mark-value-match',
  standalone: true,
  imports: [],
  template: `
    @if (filterMatch) {
      <span
        >{{ filterMatch.stringValue.substring(0, filterMatch.startIndex)
        }}<mark>{{
          filterMatch.stringValue.substring(
            filterMatch.startIndex,
            filterMatch.endIndex
          )
        }}</mark
        >{{ filterMatch.stringValue.substring(filterMatch.endIndex) }}</span
      >
    } @else {
      <span>{{ value }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementMarkValueMatchComponent {
  @Input({ required: true }) value!: PeriodicElement[keyof PeriodicElement];
  @Input() filterMatch?: FilterMatch;
}
