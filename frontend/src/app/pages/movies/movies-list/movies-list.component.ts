import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../models/movie.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="max-width: 900px; margin: 2rem auto;">
      <h2 style="text-align:center;">Movies</h2>
      <div style="display: flex; justify-content: center; margin-bottom: 2rem; align-items: center; gap: 1rem;">
        <input [(ngModel)]="searchTitle" (keyup)="searchMovies()" placeholder="Search by title" style="padding: 0.5rem; width: 250px; border-radius: 4px; border: 1px solid #ccc; margin-right: 0.5rem;" />
        <button (click)="searchMovies()" style="padding: 0.5rem 1rem; border-radius: 4px; border: none; background: #007bff; color: white;">Search</button>
        <button *ngIf="authService.isAdmin()" (click)="addOmdbMovie()" style="padding: 0.5rem 1rem; border-radius: 4px; border: none; background: #ff9800; color: white; font-weight: 600;">Add from OMDB</button>
        <button *ngIf="authService.isAdmin() && selectedMovies.length" (click)="deleteSelectedMovies()" style="padding: 0.5rem 1rem; border-radius: 4px; border: none; background: #dc3545; color: white; font-weight: 600;">Delete Selected</button>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center;">
        <div *ngFor="let movie of movies" (click)="viewDetails(movie.id!)" style="cursor:pointer; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); width: 220px; transition: box-shadow 0.2s; overflow: hidden; border: 1px solid #eee; position: relative;">
          <input *ngIf="authService.isAdmin()" type="checkbox" [(ngModel)]="movie.selected" (click)="$event.stopPropagation(); onSelectMovie(movie, $event)" style="position: absolute; top: 10px; left: 10px; z-index: 2;" />
          <img *ngIf="movie.poster" [src]="movie.poster" alt="{{movie.title}} poster" style="width: 100%; height: 320px; object-fit: cover; background: #f0f0f0;">
          <div style="padding: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #333;">{{movie.title}}</h3>
            <p style="margin: 0; color: #666;">Runtime: {{movie.runtime || 'N/A'}} min</p>
            <button *ngIf="authService.isAdmin()" (click)="deleteMovie(movie.id!); $event.stopPropagation();" style="margin-top: 0.5rem; width: 100%; background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.4rem 0; font-size: 0.95rem;">Delete</button>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
        <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 1" style="padding: 0.4rem 1rem; border-radius: 4px; border: none; background: #eee; color: #333; font-weight: 600;">Prev</button>
        <ng-container *ngFor="let page of pageNumbers">
          <button (click)="onPageChange(page)" [disabled]="page === currentPage" [ngStyle]="{ 'background': page === currentPage ? '#007bff' : '#eee', 'color': page === currentPage ? '#fff' : '#333', 'font-weight': 600, 'border-radius': '4px', 'border': 'none', 'padding': '0.4rem 1rem', 'margin': '0 2px' }">{{page}}</button>
        </ng-container>
        <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage === totalPages" style="padding: 0.4rem 1rem; border-radius: 4px; border: none; background: #eee; color: #333; font-weight: 600;">Next</button>
        <span style="align-self: center; font-weight: 600; margin-left: 1rem;">of {{totalPages}}</span>
      </div>
    </div>
  `,
  styles: ''
})
export class MoviesListComponent implements OnInit {
  movies: Movie[] = [];
  allMovies: Movie[] = [];
  searchTitle = '';
  selectedMovies: Movie[] = [];
  currentPage = 1;
  totalPages = 1;
  totalMovies = 0;
  pageSize = 10;
  isSearching = false;

  constructor(
    private movieService: MovieService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTotalMovies();
  }

  loadTotalMovies() {
    this.movieService.getNumberOfMovies().subscribe(count => {
      this.totalMovies = count;
      this.totalPages = Math.ceil(this.totalMovies / 10);
      console.log('Total movies:', this.totalMovies, 'Total pages:', this.totalPages);
      this.loadMoviesPage(1);
    });
  }

  loadMoviesPage(page: number) {
    this.isSearching = false;
    this.currentPage = page;
    this.movieService.getAllPaged(this.currentPage - 1).subscribe(movies => {
      this.movies = movies;
    });
  }

  searchMovies(page: number = 1) {
    if (this.searchTitle.trim()) {
      this.isSearching = true;
      this.currentPage = page;
      this.movieService.searchByTitle(this.searchTitle).subscribe(movies => {
        this.allMovies = movies;
        this.totalMovies = this.allMovies.length;
        this.totalPages = Math.ceil(this.totalMovies / this.pageSize);
        this.updateSearchPage();
      });
    } else {
      this.loadTotalMovies();
    }
  }

  updateSearchPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.movies = this.allMovies.slice(start, end);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    if (this.isSearching) {
      this.currentPage = page;
      this.updateSearchPage();
    } else {
      this.loadMoviesPage(page);
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 3) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else if (this.currentPage === 1) {
      pages.push(1, 2, 3);
    } else if (this.currentPage === this.totalPages) {
      pages.push(this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(this.currentPage - 1, this.currentPage, this.currentPage + 1);
    }
    return pages.filter(p => p >= 1 && p <= this.totalPages);
  }

  viewDetails(id: number) {
    this.router.navigate(['/movies', id]);
  }

  addMovie() {
    this.router.navigate(['/movies/add']);
  }

  addOmdbMovie() {
    this.router.navigate(['/movies/add-omdb']);
  }

  deleteMovie(id: number) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(id).subscribe(() => {
        this.loadTotalMovies();
      });
    }
  }

  onSelectMovie(movie: Movie, event: any) {
    if (event.target.checked) {
      if (!this.selectedMovies.some(m => m.id === movie.id)) {
        this.selectedMovies.push(movie);
      }
    } else {
      this.selectedMovies = this.selectedMovies.filter(m => m.id !== movie.id);
    }
  }

  deleteSelectedMovies() {
    if (confirm('Are you sure you want to delete the selected movies?')) {
      const ids = this.selectedMovies.map(m => m.id);
      let deletedCount = 0;
      ids.forEach(id => {
        this.movieService.deleteMovie(id!).subscribe(() => {
          deletedCount++;
          this.movies = this.movies.filter(m => m.id !== id);
          if (deletedCount === ids.length) {
            this.selectedMovies = [];
          }
        });
      });
    }
  }
} 