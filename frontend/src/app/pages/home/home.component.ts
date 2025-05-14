// Create home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Welcome to MovieRate!</h1>
      <div class="user-info">
        <p>User Role: <strong>{{userRole}}</strong></p>
        <div *ngIf="isAdmin" class="admin-message">
          <p>🔧 You have admin privileges!</p>
          <button>Manage Movies</button>
          <button>Manage Users</button>
        </div>
        <div *ngIf="!isAdmin" class="user-message">
          <p>📽️ Welcome, movie enthusiast!</p>
          <button>Browse Movies</button>
          <button>My Ratings</button>
        </div>
      </div>
      <button (click)="logout()" class="logout-btn">Logout</button>
    </div>
  `,
  styles: `
    .home-container {
      padding: 2rem;
      text-align: center;
    }
    .user-info {
      margin: 2rem 0;
      padding: 1rem;
      border-radius: 8px;
      background-color: #f5f5f5;
    }
    .admin-message {
      color: #007bff;
    }
    .user-message {
      color: #28a745;
    }
    button {
      margin: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
    .logout-btn {
      background-color: #dc3545;
    }
  `
})
export class HomeComponent implements OnInit {
  userRole: string = '';
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'Unknown';
    this.isAdmin = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    // Redirect to login or refresh page
    window.location.href = '/login';
  }
}