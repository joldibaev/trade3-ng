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
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DisabledReason, ValidationError } from '@angular/forms/signals';
import { generateId } from '../../../shared/utils/generate-id';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { InputMode } from '../ui-input/input-inputmode.type';
import { InputType } from '../ui-input/input-type.type';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  selector: 'ui-autocomplete',
  imports: [
    Combobox,
    ComboboxInput,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
    FormsModule,
    UiIcon,
    UiLoading,
  ],
  templateUrl: './ui-autocomplete.html',
  styleUrl: './ui-autocomplete.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAutocomplete<T> {
  value = model('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  items = input.required<T[] | undefined>();
  labelField = input.required<keyof T>();

  selectField = input.required<keyof T>();

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
  inputMode = input<InputMode>();
  spellCheck = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });

  id = signal(`input-${generateId()}`);

  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);

  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);

  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);

  /** The query string used to filter the list of countries. */
  /** The list of countries filtered by the query. */
  result = computed(
    () =>
      this.items()?.filter((item) =>
        String(item[this.selectField()]).toLowerCase().startsWith(this.value().toLowerCase()),
      ) ?? [],
  );

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
