import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simple password - in production this would be server-side
  // You can change this password to whatever you want
  private readonly ADMIN_PASSWORD = 'winelover2024';

  private readonly _isAuthenticated = signal<boolean>(this.checkStoredAuth());

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private checkStoredAuth(): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem('admin_auth') === 'true';
  }

  login(password: string): boolean {
    if (password === this.ADMIN_PASSWORD) {
      this._isAuthenticated.set(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated.set(false);
    sessionStorage.removeItem('admin_auth');
  }
}
