import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  protected readonly filterValue$ = new BehaviorSubject<string>('');

  setFilterValue(value: string) {
    this.filterValue$.next(value);
  }

  getFilterValue$() {
    return this.filterValue$.asObservable();
  }
}
