import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { generateId } from '../../../shared/utils/generate-id';

@Component({
  selector: 'ui-input',
  imports: [ReactiveFormsModule],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-1 w-full max-w-sm',
  },
})
export class UiInput {
  label = input<string>();
  type = input<string>('text');
  placeholder = input<string>();
  control = input<FormControl>(new FormControl(''));
  disabled = input(false, { transform: booleanAttribute });

  readonly id = signal(`input-${generateId()}`);

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
