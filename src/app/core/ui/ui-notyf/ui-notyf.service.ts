import { Injectable, signal } from '@angular/core';

export interface UiNotyfToast {
  id: number;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class UiNotyfService {
  readonly toasts = signal<UiNotyfToast[]>([]);
  private counter = 0;

  success(message: string, title?: string): void {
    this.add(message, 'success', title);
  }

  error(message: string, title?: string): void {
    this.add(message, 'error', title);
  }

  info(message: string, title?: string): void {
    this.add(message, 'info', title);
  }

  dismiss(id: number): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private add(message: string, type: 'success' | 'error' | 'info', title?: string): void {
    const id = ++this.counter;
    this.toasts.update((toasts) => [...toasts, { id, title, message, type }]);

    setTimeout(() => {
      this.dismiss(id);
    }, 5000);
  }
}
