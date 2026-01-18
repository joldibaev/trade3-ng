import { booleanAttribute, computed, Directive, input, model, signal } from '@angular/core';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';
import { generateId } from '../../shared/utils/generate-id';

@Directive()
export abstract class UiFormControl<T = string> implements FormValueControl<T> {
  // Model
  abstract value: ReturnType<typeof model<T>>;
  touched = model<boolean>(false);

  // Form State Inputs
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  required = input<boolean>(false);
  pending = input<boolean>(false);

  // Common UI Inputs
  label = input<string>();
  placeholder = input<string>('');
  loading = input(false, { transform: booleanAttribute });

  // Internal Logic
  id = signal(`${this.getIdPrefix()}-${generateId()}`);
  shouldShowError = computed(() => this.invalid() && this.touched());

  protected getIdPrefix(): string {
    return 'control';
  }
}
