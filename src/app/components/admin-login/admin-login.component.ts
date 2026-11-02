import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  password = '';
  showPassword = signal(false);
  error = signal<string | null>(null);

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  close(): void {
    this.router.navigate(['/']);
  }

  async onSubmit(): Promise<void> {
    if (this.submitting()) return;
    this.error.set(null);
    if (!this.password.trim()) {
      this.error.set('Please enter a password');
      return;
    }
    this.submitting.set(true);
    try {
      await this.authService.login(this.password);
      this.password = '';
      await this.router.navigate(['/admin']);
    } catch (error: any) {
      this.error.set(
        error.status === 401
          ? 'Invalid password'
          : error.status === 429
            ? 'Too many attempts. Try again in 15 minutes.'
            : 'Could not sign in. Check the API connection and retry.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
