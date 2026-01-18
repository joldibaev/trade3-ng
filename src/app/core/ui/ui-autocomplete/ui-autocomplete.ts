import { Combobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UiComboboxControl } from '../ui-combobox-control';
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
export class UiAutocomplete<T> extends UiComboboxControl<T> implements OnInit {
  value = model(''); // Implements abstract value from UiFormControl

  private destroyRef = inject(DestroyRef);

  // Internal input value (what user types)
  inputValue = model('');

  // search
  query = model('');
  minQueryLength = input(2, { transform: numberAttribute });
  debounce = input(500, { transform: numberAttribute });

  private query$ = toObservable(this.inputValue);

  // component specific inputs
  name = input<string>('');
  type = input<InputType>('text');
  enterKeyHint = input<string>();
  inputMode = input<InputMode>();
  spellCheck = input(false, { transform: booleanAttribute });

  filterMode = input<'manual' | 'auto-select' | 'highlight'>('manual');

  protected override getIdPrefix(): string {
    return 'autocomplete';
  }

  ngOnInit() {
    this.query$
      .pipe(
        debounceTime(this.debounce()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        if (value.length >= this.minQueryLength()) {
          this.query.set(value);
        }
      });
  }
}
