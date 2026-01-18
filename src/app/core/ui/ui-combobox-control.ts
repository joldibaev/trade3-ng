import { Combobox } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { afterRenderEffect, Directive, viewChild, viewChildren } from '@angular/core';
import { UiSelectableControl } from './ui-selectable-control';

@Directive()
export abstract class UiComboboxControl<T> extends UiSelectableControl<T> {
  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);

  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);

  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);

  constructor() {
    super();
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
