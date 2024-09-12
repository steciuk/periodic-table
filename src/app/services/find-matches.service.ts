import { Injectable } from '@angular/core';
import { FilterMatches } from '../types/utils';

@Injectable({
  providedIn: 'root',
})
export class FindMatchesService {
  findMatches<T extends object>(
    element: T,
    keys: (keyof T)[],
    query: string
  ): FilterMatches<T> {
    if (!query) {
      return {};
    }

    const filterMatches: FilterMatches<T> = {};

    for (const key of keys) {
      const stringValue = element[key]?.toString();

      if (stringValue) {
        const index = stringValue.toLowerCase().indexOf(query.toLowerCase());
        if (index !== -1) {
          filterMatches[key] = {
            stringValue,
            startIndex: index,
            endIndex: index + query.length,
          };
        }
      }
    }

    return filterMatches;
  }
}
