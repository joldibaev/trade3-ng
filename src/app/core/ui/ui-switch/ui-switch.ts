import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import {
  DisabledReason,
  FormCheckboxControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';

@Component({
  selector: 'ui-switch',
  standalone: true,
  templateUrl: './ui-switch.html',
  styleUrl: './ui-switch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UiSwitch implements FormCheckboxControl {
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

  toggle() {
    if (this.disabled() || this.readonly()) return;
    this.checked.set(!this.checked());
    this.touched.set(true);
  }
}
