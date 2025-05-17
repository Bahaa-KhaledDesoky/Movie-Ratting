import { Component } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movie-omdb-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="max-width: 700px; margin: 2rem auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); padding: 2.5rem;">
      <h2 style="text-align:center; margin-bottom: 2rem;">Search OMDB</h2>
      <form (ngSubmit)="search(1)" style="display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center;">
        <input [(ngModel)]="searchTitle" name="searchTitle" placeholder="Enter movie title" required style="padding: 0.5rem; width: 300px; border-radius: 4px; border: 1px solid #ccc;">
        <button type="submit" style="padding: 0.5rem 1.5rem; border-radius: 4px; border: none; background: #007bff; color: white; font-weight: 600;">Search</button>
      </form>
      <div *ngIf="error" style="color: #dc3545; margin-bottom: 1rem; text-align: center;">{{ error }}</div>
      <div *ngIf="results && results.length">
        <button 
          (click)="selectAll()" 
          [disabled]="!results.length" 
          style="margin-bottom: 1rem; background: #ffc107; color: #333; border: none; border-radius: 4px; padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: 600; margin-right: 1rem;">
          {{ areAllSelected() ? 'Deselect All' : 'Select All' }}
        </button>
        <button (click)="addAllSelected()" [disabled]="!selectedMovies.length" style="margin-bottom: 1rem; background: #28a745; color: white; border: none; border-radius: 4px; padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: 600;">Add All Selected</button>
        <h3 style="margin-bottom: 1rem; color: #007bff;">Results</h3>
        <div *ngFor="let movie of results; let i = index" style="background: #f8f9fa; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 1.5rem;">
          <input type="checkbox" [(ngModel)]="movie.selected" (change)="onSelectMovie(movie, $event)" name="selectMovie{{i}}" style="margin-right: 1rem;">
          <img *ngIf="movie.Poster && movie.Poster !== 'N/A'" [src]="movie.Poster" alt="{{movie.Title}} poster" style="width: 80px; height: 120px; object-fit: cover; border-radius: 6px; background: #e0e0e0;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 0.5rem 0;">{{movie.Title}}</h4>
            <div style="color: #555;">Year: {{movie.Year}}</div>
            <div style="color: #555;">Type: {{movie.Type}}</div>
            <button (click)="addFromOmdb(movie.imdbID)" style="margin-top: 0.5rem; background: #28a745; color: white; border: none; border-radius: 4px; padding: 0.4rem 1.2rem; font-size: 0.95rem;">Add to Database</button>
          </div>
        </div>
        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <button (click)="search(currentPage - 1)" [disabled]="currentPage === 1" style="padding: 0.4rem 1rem; border-radius: 4px; border: none; background: #eee; color: #333; font-weight: 600;">Prev</button>
          <ng-container *ngFor="let page of pageNumbers">
            <button (click)="search(page)" [disabled]="page === currentPage" [ngStyle]="{ 'background': page === currentPage ? '#007bff' : '#eee', 'color': page === currentPage ? '#fff' : '#333', 'font-weight': 600, 'border-radius': '4px', 'border': 'none', 'padding': '0.4rem 1rem', 'margin': '0 2px' }">{{page}}</button>
          </ng-container>
          <button (click)="search(currentPage + 1)" [disabled]="currentPage === totalPages" style="padding: 0.4rem 1rem; border-radius: 4px; border: none; background: #eee; color: #333; font-weight: 600;">Next</button>
          <span style="align-self: center; font-weight: 600; margin-left: 1rem;">of {{totalPages}}</span>
        </div>
      </div>
      <div *ngIf="success" style="color: #28a745; margin-top: 1rem; text-align: center;">{{ success }}</div>
    </div>
  `,
  styles: ''
})
export class MovieOmdbSearchComponent {
  searchTitle = '';
  results: any[] = [];
  error = '';
  success = '';
  selectedMovies: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;

  constructor(
    private movieService: MovieService,
    private http: HttpClient
  ) {}

  search(page: number = 1) {
    this.error = '';
    this.success = '';
    this.results = [];
    this.currentPage = page;
    this.movieService.searchOmdb(this.searchTitle, this.currentPage).subscribe({
      next: (res: any) => {
        this.results = res?.Search || [];
        this.totalResults = parseInt(res?.totalResults || '0', 10);
        this.totalPages = Math.ceil(this.totalResults / 10);
        if (!this.results.length) {
          this.error = 'No results found.';
        }
      },
      error: (err) => {
        this.error = err.error || 'Error searching OMDB.';
      }
    });
  }

  addFromOmdb(imdbID: string) {
    this.error = '';
    this.success = '';
    this.http.post(`http://localhost:8081/api/movie/addMoviefromOmdb/${encodeURIComponent(imdbID)}`, {}).subscribe({
      next: () => {
        this.success = `Movie added successfully!`;
      },
      error: (err) => {
        this.error = err.error || `Could not add this movie`;
      }
    });
  }

  onSelectMovie(movie: any, event: any) {
    if (event.target.checked) {
      if (!this.selectedMovies.some(m => m.imdbID === movie.imdbID)) {
        this.selectedMovies.push(movie);
      }
    } else {
      this.selectedMovies = this.selectedMovies.filter(m => m.imdbID !== movie.imdbID);
    }
  }

  addAllSelected() {
    this.error = '';
    this.success = '';
    if (!this.selectedMovies.length) return;

    const requests = this.selectedMovies.map(movie =>
      this.http.get(`http://localhost:8081/api/movie/getMoviefromOmdb/${encodeURIComponent(movie.imdbID)}`)
    );

    forkJoin(requests).subscribe({
      next: (movies: any[]) => {
        this.http.post('http://localhost:8081/api/movie/addMovies', movies).subscribe({
          next: () => {
            this.success = 'All selected movies added successfully!';
            this.selectedMovies = [];
            this.results.forEach(m => m.selected = false);
          },
          error: (err) => {
            this.error = err.error || 'Could not add movies.';
          }
        });
      },
      error: (err) => {
        this.error = err.error || 'Error fetching movie details.';
      }
    });
  }

  selectAll() {
    if (this.areAllSelected()) {
      
      this.results.forEach(m => {
        m.selected = false;
      });
      this.selectedMovies = [];
    } else {
      
      this.results.forEach(m => {
        m.selected = true;
      });
      this.selectedMovies = this.results.slice();
    }
  }

  areAllSelected(): boolean {
    return this.results.length > 0 && this.results.every(m => m.selected);
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
} 