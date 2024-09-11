import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseComponent implements OnDestroy {
  protected subs = new SubSink();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected finalize(): void {}

  ngOnDestroy(): REQUIRED_SUPER {
    this.finalize();
    this.subs.unsubscribe();
    return new REQUIRED_SUPER();
  }
}

class REQUIRED_SUPER {}
