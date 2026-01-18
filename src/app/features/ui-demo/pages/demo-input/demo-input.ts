import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  disabled,
  email,
  form,
  FormField,
  hidden,
  minLength,
  readonly,
  required,
  validateAsync,
} from '@angular/forms/signals';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { InputType } from '../../../../core/ui/ui-input/input-type.type';
import { UiInput } from '../../../../core/ui/ui-input/ui-input';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-input',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiInput, FormsModule, UiButton, JsonPipe, FormField],
  templateUrl: './demo-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoInputPage {
  // Signals for Configuration Props
  configType = signal<InputType>('text');
  configPlaceholder = signal('Enter something...');
  configLoading = signal(false);
  configSpellcheck = signal(false);
  configInputMode = signal<string>('text');
  configEnterKeyHint = signal('done');

  // Signal Form
  formState = signal({
    username: '',
    email: '',
    password: '',
    pension: '',
    secretCode: '1234',
    hiddenField: 'I am hiding',
    notEditable: 'You cannot change me',
    configTest: '',
  });

  demoForm = form(this.formState, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'Username must be at least 3 characters' });

    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Invalid email format' });

    required(p.password, { message: 'Password is required' });

    disabled(p.pension, ({ valueOf }) =>
      valueOf(p.username) === '' ? 'Fill username first to enable pension field' : false,
    );

    hidden(p.hiddenField, ({ valueOf }) => valueOf(p.username) === 'hide');
    readonly(p.notEditable, ({ valueOf }) => valueOf(p.username) === 'lock');

    validateAsync(p.secretCode, {
      params: (ctx) => ctx.value(),
      factory: (val) =>
        resource({
          params: () => val(),
          loader: async ({ params: v }) => {
            if (!v || v === '1234') return { valid: true };
            if (v === 'pending') {
              await new Promise((r) => setTimeout(r, 2000));
              return { valid: true };
            }
            return { valid: false };
          },
        }),
      onSuccess: (res) =>
        res?.valid ? null : { kind: 'wrong-code', message: 'Secret code must be 1234' },
      onError: () => ({ kind: 'error', message: 'Validation failed' }),
    });
  });

  resetForm() {
    this.demoForm().reset();
  }

  markAllTouched() {
    this.demoForm.username().markAsTouched();
    this.demoForm.email().markAsTouched();
    this.demoForm.password().markAsTouched();
  }
}
