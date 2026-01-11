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
  linkedSignal,
  model,
  signal,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { DisabledReason, ValidationError } from '@angular/forms/signals';
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
  value = model('');

  label = input<string>();
  placeholder = input('Ничего не выбрано');
  loading = input(false, { transform: booleanAttribute });

  items = input.required<T[] | undefined>();
  labelField = input.required<keyof T>();

  selectField = input.required<keyof T>();
  protected selectedList = linkedSignal<string[]>(() => {
    const value = this.value();
    return value.length ? value.split(',') : [];
  });

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly ValidationError.WithField[]>([]);
  required = input<boolean>(false);

  id = signal(`input-${generateId()}`);

  /** The string that is displayed in the combobox. */
  displayValue = computed<string | undefined>(() => {
    const items = this.items()?.filter((item) =>
      this.selectedList().includes(String(item[this.selectField()])),
    );

    if (items?.length) return items.map((item) => item[this.labelField()]).join(', ');
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

  protected valuesChange(selectedList: string[]) {
    const list = selectedList.join(',');
    if (list.length) {
      if (list !== this.value()) this.value.set(list);
    } else {
      this.value.set('');
    }
  }
}
