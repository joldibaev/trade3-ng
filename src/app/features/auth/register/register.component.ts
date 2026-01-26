import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiButton } from '../../../core/ui/ui-button/ui-button';
import { UiIcon } from '../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../core/ui/ui-input/ui-input';
import { UiNotyfService } from '../../../core/ui/ui-notyf/ui-notyf.service';
import { UiTitle } from '../../../core/ui/ui-title/ui-title';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, UiInput, UiButton, UiTitle, UiIcon, FormField, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notyf = inject(UiNotyfService);

  isLoading = signal(false);

  formState = signal({
    email: '',
    password: '',
    confirmPassword: '',
  });

  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.email, { message: 'Email обязателен' });
    email(schemaPath.email, { message: 'Некорректный email' });
    required(schemaPath.password, { message: 'Пароль обязателен' });
    required(schemaPath.confirmPassword, { message: 'Подтверждение пароля обязательно' });
  });

  passwordMismatch = computed(() => {
    const state = this.formState();
    return state.password !== state.confirmPassword && state.confirmPassword !== '';
  });

  onSubmit(): void {
    if (this.formData().invalid() || this.passwordMismatch()) {
      if (this.passwordMismatch()) {
        this.notyf.error('Пароли не совпадают');
      }
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.formData().value();

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.notyf.success('Аккаунт успешно создан. Теперь вы можете войти.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.notyf.error(err.error?.message || 'Ошибка регистрации');
      },
    });
  }
}
