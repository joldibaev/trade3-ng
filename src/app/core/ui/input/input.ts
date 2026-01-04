import { booleanAttribute, ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-1 w-full max-w-sm'
  }
})
export class Input {
  label = input<string>();
  type = input<string>('text');
  placeholder = input<string>();
  control = input<FormControl>(new FormControl(''));
  disabled = input(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.control().disable();
      } else {
        this.control().enable();
      }
    });
  }
}
