import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, UiInput, UiButton, UiTitle, UiIcon, FormField, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notyf = inject(UiNotyfService);

  isLoading = signal(false);

  formState = signal({
    email: '',
    password: '',
  });

  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.email, { message: 'Email обязателен' });
    email(schemaPath.email, { message: 'Некорректный email' });
    required(schemaPath.password, { message: 'Пароль обязателен' });
  });

  onSubmit(): void {
    if (this.formData().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.authService.login(this.formData().value()).subscribe({
      next: () => {
        this.notyf.success('Вы успешно вошли в систему');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.notyf.error(err.error?.message || 'Ошибка входа');
      },
    });
  }
}
