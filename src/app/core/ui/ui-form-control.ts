import { booleanAttribute, computed, Directive, input, model, signal } from '@angular/core';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';
import { generateId } from '../../shared/utils/generate-id';
import { IconName } from './ui-icon/data';
import { InputAutocomplete } from './ui-input/input-autocomplete.type';
import { InputMode } from './ui-input/input-inputmode.type';
import { InputType } from './ui-input/input-type.type';

@Directive()
export abstract class UiFormControl<T> implements FormValueControl<T> {
  abstract value: ReturnType<typeof model<T>>;

  touched = model<boolean>(false);

  // Form State Inputs
  disabled = input(false, { transform: booleanAttribute });
  disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly = input(false, { transform: booleanAttribute });
  hidden = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  required = input(false, { transform: booleanAttribute });
  pending = input(false, { transform: booleanAttribute });

  // Common UI Inputs
  label = input<string>();
  name = input<string>('');
  type = input<InputType>('text');
  enterKeyHint = input<string>();
  placeholder = input<string>('');
  autocomplete = input<InputAutocomplete>('off');
  inputMode = input<InputMode>();
  spellCheck = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  icon = input<IconName>();

  // Internal Logic
  id = signal(`${this.getIdPrefix()}-${generateId()}`);
  shouldShowError = computed(() => this.invalid() && this.touched());

  protected getIdPrefix(): string {
    return 'control';
  }
}
