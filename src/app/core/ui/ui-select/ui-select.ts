import { Combobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { UiComboboxControl } from '../ui-combobox-control';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiLoading } from '../ui-loading/ui-loading';

// todo validation and required state
@Component({
  selector: 'ui-select',
  templateUrl: './ui-select.html',
  styleUrl: './ui-select.css',
  imports: [
    Combobox,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
    ComboboxInput,
    UiIcon,
    UiLoading,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelect<T> extends UiComboboxControl<T> {
  value = model(''); // Implements abstract value from UiFormControl

  protected override getIdPrefix(): string {
    return 'select';
  }

  /** The string that is displayed in the combobox. */
  displayValue = computed<string | undefined>(() => {
    const items = this.items()?.filter((item) =>
      this.selectedList().includes(String(item[this.optionField()])),
    );

    if (items?.length) return items.map((item) => item[this.optionLabel()]).join(', ');
    return undefined;
  });
}
