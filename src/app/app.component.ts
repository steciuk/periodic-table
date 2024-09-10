import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule],
  template: ` <h1>{{ title }}</h1>
    <button mat-button>Click me!</button>`,
})
export class AppComponent {
  title = 'Hello, World';
}
