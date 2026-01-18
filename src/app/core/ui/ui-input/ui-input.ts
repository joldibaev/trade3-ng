import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { UiFormControl } from '../ui-form-control';
import { UiLoading } from '../ui-loading/ui-loading';
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
  imports: [UiLoading],
})
export class UiInput extends UiFormControl {
  value = model('');

  // component specific inputs
  name = input<string>('');
  type = input<InputType>('text');
  enterKeyHint = input<string>();
  override placeholder = input<string>('');
  autocomplete = input<InputAutocomplete>('on');
  inputMode = input<InputMode>();
  spellCheck = input(false, { transform: booleanAttribute });
  override loading = input(false, { transform: booleanAttribute });

  protected override getIdPrefix(): string {
    return 'input';
  }

  protected onInput(target: EventTarget | null) {
    if (!(target && target instanceof HTMLInputElement)) return;
    this.value.set(target.value);
  }
}
