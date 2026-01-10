import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  signal,
} from '@angular/core';
import { DisabledReason, ValidationError } from '@angular/forms/signals';
import { generateId } from '../../../shared/utils/generate-id';
import { InputAutocomplete } from './input-autocomplete.type';
import { InputMode } from './input-inputmode.type';
import { InputType } from './input-type.type';

@Component({
  selector: 'ui-input',
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-1 w-full empty:hidden',
  },
  imports: [],
})
export class UiInput {
  // todo delete number
  value = model<string | number>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly ValidationError.WithField[]>([]);
  required = input<boolean>(false);

  // component inputs
  label = input<string>();

  name = input<string>('');
  type = input<InputType>('text');
  enterKeyHint = input<string>();
  placeholder = input<string>('');
  autocomplete = input<InputAutocomplete>('on');
  inputMode = input<InputMode>();
  spellCheck = input(false, { transform: booleanAttribute });

  id = signal(`input-${generateId()}`);

  protected onInput(target: EventTarget | null) {
    if (!(target && target instanceof HTMLInputElement)) return;
    this.value.set(target.value);
  }
}
