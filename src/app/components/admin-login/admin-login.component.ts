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
    MatCardModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  password = '';
  showPassword = signal(false);
  error = signal<string | null>(null);

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.error.set(null);

    if (!this.password.trim()) {
      this.error.set('Please enter a password');
      return;
    }

    if (this.authService.login(this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.error.set('Invalid password');
      this.password = '';
    }
  }
}
