import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
}

export const AUTH_STORAGE_KEY = 'isAuthenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // State
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Read-only public state
  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.userSignal());
  accessToken = computed(() => this.tokenSignal());

  // URL for API
  private apiUrl = '/api/auth';

  constructor() {
    this.restoreSession();
  }

  register(data: unknown): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      }),
    );
  }

  private handleAuthSuccess(res: AuthResponse): void {
    const user = this.parseToken(res.accessToken);

    this.tokenSignal.set(res.accessToken);
    this.userSignal.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    void this.router.navigate(['/auth/login']);
  }

  private restoreSession(): void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem(AUTH_STORAGE_KEY)) {
      // Attempt to refresh token on startup if we were previously logged in
      this.refreshToken().subscribe({
        error: () => console.warn('Could not restore session'),
      });
    }
  }

  private parseToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }
}
