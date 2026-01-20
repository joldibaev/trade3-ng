import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { UiFormControl } from '../ui-form-control';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  selector: 'ui-input-number',
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-1 w-full empty:hidden',
  },
  imports: [UiLoading, UiIcon],
})
export class UiInputNumber extends UiFormControl<number> {
  value = model(0);

  protected override getIdPrefix(): string {
    return 'input';
  }

  protected onInput(target: EventTarget | null) {
    if (!(target && target instanceof HTMLInputElement)) return;

    const value = target.valueAsNumber;
    this.value.set(value);
  }
}
