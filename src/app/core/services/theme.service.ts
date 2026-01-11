import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();

    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem('theme', currentTheme);

      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      this.theme.set(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme.set('dark');
    }
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}
