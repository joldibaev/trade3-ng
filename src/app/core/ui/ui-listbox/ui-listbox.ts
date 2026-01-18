import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiLoading } from '../ui-loading/ui-loading';
import { UiSelectableControl } from '../ui-selectable-control';

@Component({
  selector: 'ui-listbox',
  imports: [Listbox, Option, UiLoading, UiIcon],
  templateUrl: './ui-listbox.html',
  styleUrl: './ui-listbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden rounded-lg border border-slate-200 bg-white',
  },
})
export class UiListbox<T> extends UiSelectableControl<T> {
  // Styling inputs
  height = input<string>('300px');

  value = model('');

  protected override getIdPrefix(): string {
    return 'listbox';
  }
}
