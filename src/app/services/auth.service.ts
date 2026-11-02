import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly key = 'wine_admin_session';
  private readonly authenticated = signal(false);
  readonly isAuthenticated = this.authenticated.asReadonly();

  get token(): string | null {
    try {
      const session = JSON.parse(sessionStorage.getItem(this.key) || 'null');
      if (session && typeof session.token === 'string' && session.expiresAt > Date.now())
        return session.token;
    } catch {
      /* Missing or invalid browser storage is an anonymous session. */
    }
    this.clear();
    return null;
  }

  clear(): void {
    this.authenticated.set(false);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.key);
      sessionStorage.removeItem('admin_auth');
    }
  }

  async login(password: string): Promise<void> {
    const session = await firstValueFrom(
      this.http.post<{ token: string; expiresAt: number }>(`${environment.apiUrl}/auth/login`, {
        password,
      }),
    );
    sessionStorage.setItem(this.key, JSON.stringify(session));
    this.authenticated.set(true);
  }

  async checkSession(): Promise<boolean> {
    if (!this.token) return false;
    try {
      await firstValueFrom(this.http.get(`${environment.apiUrl}/auth/session`));
      this.authenticated.set(true);
      return true;
    } catch {
      this.clear();
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/logout`, {}));
    } finally {
      this.clear();
    }
  }
}
