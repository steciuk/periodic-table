import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-clearable-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        type="text"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
      />
      @if (value) {
      <button matSuffix mat-icon-button aria-label="Clear" (click)="clear()">
        <mat-icon>close</mat-icon>
      </button>
      }
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearableInputComponent {
  @Input() label = 'Input';
  @Input() initValue = '';
  @Output() readonly valueChange = new EventEmitter<string>();

  protected value = this.initValue;

  protected onValueChange(value: string) {
    this.valueChange.emit(value);
  }

  protected clear() {
    this.value = '';
    this.valueChange.emit('');
  }
}
