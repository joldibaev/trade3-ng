import { Directive, input, linkedSignal } from '@angular/core';
import { UiFormControl } from './ui-form-control';

@Directive()
export abstract class UiSelectableControl<T> extends UiFormControl<string> {
  items = input.required<T[] | undefined>();
  optionLabel = input.required<keyof T>();
  optionField = input.required<keyof T>();

  /**
   * Helper signal to handle multiple values (comma separated) for Listbox/Select
   */
  protected selectedList = linkedSignal<string[]>(() => {
    const value = this.value();
    return value.length ? value.split(',') : [];
  });

  /**
   * Helper method to handle value changes from Listbox/Select
   */
  protected valuesChange(event: string[]) {
    const list = event.join(',');
    if (list.length) {
      if (list !== this.value()) this.value.set(list);
    } else {
      this.value.set('');
    }
  }
}
