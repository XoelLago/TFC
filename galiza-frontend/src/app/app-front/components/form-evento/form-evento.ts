import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-form-evento',
  imports: [],
  template: `<p>form-evento works!</p>`,
  styleUrl: './form-evento.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormEvento { }
