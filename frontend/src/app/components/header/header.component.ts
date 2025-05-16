import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #222; color: #fff;">
      <div style="display: flex; align-items: center; gap: 2rem;">
        <img src="assets/logo.png" alt="Logo" style=" height: 60px; margin-right: 1rem;" />
        <a routerLink="/movies" style="color: #fff; text-decoration: none; font-weight: 600; font-size: 1.2rem;">Movies</a>
        <a *ngIf="authService.isAdmin()" routerLink="/movies/add-omdb" style="color: #ff9800; text-decoration: none; font-weight: 600; font-size: 1.2rem;">Add from OMDB</a>
    </div>
      <button (click)="logout()" style="background: #dc3545; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: 600; cursor: pointer;">Logout</button>
    </nav>
  `,
  styles: ''
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
