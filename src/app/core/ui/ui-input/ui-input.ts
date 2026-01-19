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
export class UiInput<T = string> extends UiFormControl<T> {
  value = model<T>(undefined as unknown as T);

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

    let val: unknown = target.value;
    if (this.type() === 'number') {
      val = target.valueAsNumber;
      if (isNaN(val as number)) val = undefined;
    }

    this.value.set(val as T);
  }
}
