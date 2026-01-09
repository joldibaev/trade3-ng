import { Combobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { generateId } from '../../../shared/utils/generate-id';
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
  encapsulation: ViewEncapsulation.None,
})
export class UiSelect<T> {
  label = input<string>();
  placeholder = input('Ничего не выбрано');
  disabled = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });

  items = input.required<T[] | undefined>();
  labelField = input.required<keyof T>();

  selectField = input.required<keyof T>();
  selectedList = model<string[]>([]);

  id = signal(`input-${generateId()}`);

  /** The string that is displayed in the combobox. */
  displayValue = computed<string | undefined>(() => {
    const values = this.selectedList() || [];
    const value = values.at(0);

    if (value) {
      const item = this.items()?.find((item) => item[this.selectField()] === value);
      return item ? String(item[this.labelField()]) : undefined;
    }

    return undefined;
  });

  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);

  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);

  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);

  constructor() {
    // Scrolls to the active item when the active option changes.
    // The slight delay here is to ensure animations are done before scrolling.
    afterRenderEffect(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });

    // Resets the listbox scroll position when the combobox is closed.
    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
  }
}
