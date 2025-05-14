import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="login-container">
      <form (ngSubmit)="onSubmit()" class="login-form">
        <h2>Login to MovieRate</h2>
        
        <div class="form-group">
          <input
            type="text"
            [(ngModel)]="credentials.username"
            name="username"
            placeholder="Username"
            required
            [disabled]="loading">
        </div>

        <div class="form-group">
          <input
            type="password"
            [(ngModel)]="credentials.password"
            name="password"
            placeholder="Password"
            required
            [disabled]="loading">
        </div>

        <button type="submit" [disabled]="loading" class="btn-login">
          {{loading ? 'Logging in...' : 'Login'}}
        </button>

        <div *ngIf="error" class="error-message">
          {{error}}
        </div>

        <p>Don't have an account? <a routerLink="/signup">Sign up here</a></p>
      </form>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Arial', sans-serif;
    }
    
    .login-form {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
      font-weight: 600;
    }
    
    .form-group {
      margin-bottom: 1.2rem;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }
    
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .btn-login {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.3s ease;
      font-weight: 600;
    }
    
    .btn-login:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
    
    p {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    a:hover {
      text-decoration: underline;
    }
  `
})
export class LoginComponent {
  credentials: UserRequest = {
    username: '',
    password: ''
  };
  
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Save both access and refresh tokens
        this.authService.saveToken(response.tokenResponse.accessToken);
        this.authService.saveRefreshToken(response.tokenResponse.refreshToken);

        // Save user role
        this.authService.saveUserRole(response.userRole);

        this.loading = false;

        // Navigate based on role
        if (response.userRole === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/movies']);
        }
      },
      error: (err) => {
        console.log('Login error:', err);

        let errorMessage = '';

        if (err.status === 400) {
          errorMessage = err.error || 'Invalid username or password';
        } else if (err.error) {
          errorMessage = err.error;
        } else {
          errorMessage = 'Login failed. Please try again.';
        }

        this.error = errorMessage;
        this.loading = false;
      }
    });
  }
}