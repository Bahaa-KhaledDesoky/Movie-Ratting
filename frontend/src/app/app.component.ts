import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CommonModule],
  template: `
    <ng-container *ngIf="!isAuthPage()">
      <app-header></app-header>
    </ng-container>
    <router-outlet></router-outlet>
  `,
  styles: ''
})
export class AppComponent {
  constructor(private router: Router) {}

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }
}
