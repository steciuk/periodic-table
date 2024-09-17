import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private readonly state = rxState<{ filter: string }>(({ set }) => {
    set({ filter: '' });
  });

  setFilter(value: string) {
    this.state.set({ filter: value });
  }

  readonly filter$ = this.state.select('filter');
}
