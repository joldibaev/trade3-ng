import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component, input, linkedSignal, model } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  selector: 'ui-listbox',
  imports: [Listbox, Option, UiLoading, UiIcon],
  templateUrl: './ui-listbox.html',
  styleUrl: './ui-listbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden rounded-lg border border-neutral-200 bg-white',
  },
})
export class UiListbox<T> {
  // Model
  value = model('');

  items = input.required<T[] | undefined>();
  optionLabel = input.required<keyof T>();
  optionField = input.required<keyof T>();
  protected selectedList = linkedSignal<string[]>(() => {
    const value = this.value();
    return value.length ? value.split(',') : [];
  });

  // Inputs
  loading = input<boolean>(false);

  // Styling inputs
  height = input<string>('300px');

  protected valuesChange(selectedList: string[]) {
    const list = selectedList.join(',');
    if (list.length) {
      if (list !== this.value()) this.value.set(list);
    } else {
      this.value.set('');
    }
  }
}
