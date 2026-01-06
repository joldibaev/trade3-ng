import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  disabled,
  email,
  Field,
  form,
  hidden,
  maxLength,
  minLength,
  pattern,
  readonly,
  required,
} from '@angular/forms/signals';
import { UiButton } from '../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../core/ui/ui-card/ui-card';
import { UiInput } from '../../../core/ui/ui-input/ui-input';

@Component({
  selector: 'app-ui-demo-input-page',
  imports: [UiInput, UiButton, Field, JsonPipe, UiCard],
  templateUrl: './ui-demo-input-page.html',
  styleUrl: './ui-demo-input-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class UiDemoInputPage {
  globalDisabled = signal(false);
  showSecret = signal(false);

  demoForm = form(
    signal({
      email: 'user@example.com',
      age: 21,
      password: '',
      phone: '',
      website: '',
      birthday: '',
      notes: '',
      secretKey: 'top-secret-123',
      search: '',
    }),
    (schemaPath) => {
      // Validations
      required(schemaPath.email, { message: 'Электронная почта обязательна' });
      email(schemaPath.email, { message: 'Некорректный формат почты' });

      required(schemaPath.age, { message: 'Возраст обязателен' });

      required(schemaPath.password, { message: 'Пароль обязателен' });
      minLength(schemaPath.password, 8, { message: 'Пароль должен быть не менее 8 символов' });

      pattern(schemaPath.phone, /^\+?[0-9]{10,12}$/, {
        message: 'Неверный формат телефона (напр. +79991234455)',
      });

      required(schemaPath.website, { message: 'Сайт обязателен' });
      pattern(schemaPath.website, /^https?:\/\/.*/, {
        message: 'Сайт должен начинаться с http:// или https://',
      });

      // Interactive Logic
      disabled(schemaPath, () => (this.globalDisabled() ? 'Форма отключена глобально' : false));

      // Email disabled for minors
      disabled(schemaPath.email, ({ valueOf }) =>
        valueOf(schemaPath.age) < 18
          ? 'Редактирование почты ограничено для лиц младше 18 лет'
          : false,
      );

      // Password readonly for specific emails
      readonly(schemaPath.password, ({ valueOf }) =>
        valueOf(schemaPath.email).includes('readonly'),
      );

      // Hidden logic
      hidden(schemaPath.secretKey, () => !this.showSecret());

      // Length constraints
      maxLength(schemaPath.notes, 50, { message: 'Заметки не должны превышать 50 символов' });
    },
  );
}
