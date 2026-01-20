import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  DisabledReason,
  FormCheckboxControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';
import { generateId } from '../../../shared/utils/generate-id';
import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-checkbox',
  imports: [UiIcon],
  templateUrl: './ui-checkbox.html',
  styleUrl: './ui-checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UiCheckbox implements FormCheckboxControl {
  // Required for FormCheckboxControl
  checked = model(false);

  // Optional state signals supported by FormField
  touched = model(false);
  disabled = input(false);
  disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  invalid = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  required = input(false);
  readonly = input(false);
  pending = input(false);

  // Component specific inputs
  label = input<string>('');
  id = signal(`checkbox-${generateId()}`);

  toggle() {
    if (this.disabled() || this.readonly()) return;
    this.checked.set(!this.checked());
    this.touched.set(true);
  }
}
