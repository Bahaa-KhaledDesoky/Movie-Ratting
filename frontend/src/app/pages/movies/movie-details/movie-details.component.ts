import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../models/movie.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="movie" style="max-width: 800px; margin: 2rem auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); padding: 2.5rem;">
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: flex-start;">
        <img *ngIf="movie.poster && movie.poster !== 'N/A'" [src]="movie.poster" alt="{{movie.title}} poster" style="max-width: 260px; width: 100%; border-radius: 12px; background: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="flex: 1 1 300px;">
          <h2 style="margin-bottom: 1rem; font-size: 2rem; color: #222; letter-spacing: 1px;">{{movie.title}}</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
            <div *ngIf="movie.year && movie.year !== 'N/A'" style="background: #f8f9fa; border-radius: 8px; padding: 0.5rem 1rem;"><strong>Year:</strong> {{movie.year}}</div>
            <div *ngIf="movie.rated && movie.rated !== 'N/A'" style="background: #f8f9fa; border-radius: 8px; padding: 0.5rem 1rem;"><strong>Rated:</strong> {{movie.rated}}</div>
            <div *ngIf="movie.released && movie.released !== 'N/A'" style="background: #f8f9fa; border-radius: 8px; padding: 0.5rem 1rem;"><strong>Released:</strong> {{movie.released}}</div>
            <div *ngIf="movie.runtime && movie.runtime !== 'N/A'" style="background: #f8f9fa; border-radius: 8px; padding: 0.5rem 1rem;"><strong>Runtime:</strong> {{movie.runtime}}</div>
            <div *ngIf="movie.genre && movie.genre !== 'N/A'" style="background: #f8f9fa; border-radius: 8px; padding: 0.5rem 1rem;"><strong>Genre:</strong> {{movie.genre}}</div>
            <div *ngIf="movie.type && movie.type !== 'N/A'" style="background: #f8f9fa; border-radius: 8px; padding: 0.5rem 1rem;"><strong>Type:</strong> {{movie.type}}</div>
          </div>
          <div *ngIf="movie.plot && movie.plot !== 'N/A'" style="margin-bottom: 1.2rem; color: #555;"><strong>Plot:</strong> {{movie.plot}}</div>
          <div *ngIf="movie.director && movie.director !== 'N/A'" ><strong>Director:</strong> {{movie.director}}</div>
          <div *ngIf="movie.writer && movie.writer !== 'N/A'" ><strong>Writer:</strong> {{movie.writer}}</div>
          <div *ngIf="movie.actors && movie.actors !== 'N/A'" ><strong>Actors:</strong> {{movie.actors}}</div>
          <div *ngIf="movie.language && movie.language !== 'N/A'" ><strong>Language:</strong> {{movie.language}}</div>
          <div *ngIf="movie.country && movie.country !== 'N/A'" ><strong>Country:</strong> {{movie.country}}</div>
          <div *ngIf="movie.awards && movie.awards !== 'N/A'" ><strong>Awards:</strong> {{movie.awards}}</div>
          <div *ngIf="movie.metascore && movie.metascore !== 'N/A'" ><strong>Metascore:</strong> {{movie.metascore}}</div>
          <div *ngIf="movie.imdbRating && movie.imdbRating !== 'N/A'" ><strong>IMDB Rating:</strong> {{movie.imdbRating}}</div>
          <div *ngIf="movie.imdbVotes && movie.imdbVotes !== 'N/A'" ><strong>IMDB Votes:</strong> {{movie.imdbVotes}}</div>
          <div *ngIf="movie.imdbID && movie.imdbID !== 'N/A'" ><strong>IMDB ID:</strong> {{movie.imdbID}}</div>
          <div *ngIf="movie.dvd && movie.dvd !== 'N/A'" ><strong>DVD Release:</strong> {{movie.dvd}}</div>
          <div *ngIf="movie.boxOffice && movie.boxOffice !== 'N/A'" ><strong>Box Office:</strong> {{movie.boxOffice}}</div>
          <div *ngIf="movie.production && movie.production !== 'N/A'" ><strong>Production:</strong> {{movie.production}}</div>
          <div *ngIf="movie.website && movie.website !== 'N/A'" ><strong>Website:</strong> <a [href]="movie.website" target="_blank">{{movie.website}}</a></div>
        </div>
      </div>
      <form *ngIf="!hasRated && authService.isLoggedIn()" (ngSubmit)="submitRating()" style="margin-top: 2.5rem; background: #f8f9fa; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
        <h3 style="margin-bottom: 1rem; color: #ff9800; font-size: 1.2rem;">Add Your Rating</h3>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <label for="rate" style="font-weight: 500;">Rate (0-10):</label>
          <input id="rate" name="rate" type="number" min="0" max="10" [(ngModel)]="userRating" required style="width: 60px; padding: 0.3rem; border-radius: 4px; border: 1px solid #ccc;">
          <button type="submit" [disabled]="submitting" style="padding: 0.4rem 1.2rem; border-radius: 4px; border: none; background: #ff9800; color: white; font-weight: 600;">Submit</button>
        </div>
        <div *ngIf="ratingError" style="color: #dc3545; margin-top: 0.5rem;">{{ ratingError }}</div>
        <div *ngIf="ratingSuccess" style="color: #28a745; margin-top: 0.5rem;">{{ ratingSuccess }}</div>
      </form>
      <div *ngIf="getRatings(movie).length" style="margin-top: 2.5rem;">
        <h3 style="margin-bottom: 1rem; color: #007bff; font-size: 1.3rem;">Ratings</h3>
        <ng-container *ngFor="let rating of getRatings(movie)">
          <div *ngIf="(rating.Source || rating.source) !== 'N/A' && (rating.Value || rating.value) !== 'N/A'" style="background: #e9f5ff; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
            <strong>Source:</strong> <span style="color: #0056b3;">{{ rating.Source || rating.source }}</span><br>
            <strong>Value:</strong> <span style="color: #0056b3;">{{ rating.Value || rating.value }}</span>
          </div>
        </ng-container>
      </div>
      <div *ngIf="movie.ratings && movie.ratings.length" style="margin-top: 2.5rem;">
        <h3 style="margin-bottom: 1rem; color: #28a745; font-size: 1.3rem;">User Ratings</h3>
        <div *ngFor="let rating of movie.ratings" style="background: #f3f9f3; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between;">
          <span><strong>User:</strong> <span style="color: #218838;">{{ rating.user_name }}</span></span>
          <span><strong>Rate:</strong> <span style="color: #218838; font-size: 1.1rem;">{{ rating.rate }}</span></span>
        </div>
      </div>
    </div>
  `,
  styles: ''
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;
  userRating: number = 0;
  hasRated = false;
  submitting = false;
  ratingError = '';
  ratingSuccess = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovie(id).subscribe(movie => {
      this.movie = movie;
      this.checkIfRated();
    });
  }

  checkIfRated() {
    const username = this.authService.getUsernameFromToken();
    this.hasRated = !!(this.movie && this.movie.ratings && this.movie.ratings.some(r => r.user_name === username));
  }

  submitRating() {
    if (!this.movie) return;
    this.submitting = true;
    this.ratingError = '';
    this.ratingSuccess = '';
    this.http.post('http://localhost:8081/api/ratting/addRate', { movie: this.movie.id, rate: this.userRating }).subscribe({
      next: () => {
        this.ratingSuccess = 'Your rating has been submitted!';
        // Add the new rating to the list for instant feedback
        const username = this.authService.getUsernameFromToken();
        if (this.movie && this.movie.ratings) {
          this.movie.ratings.push({ id: Date.now(), user_name: username || '', movie_id: this.movie.id!, rate: this.userRating });
        }
        this.hasRated = true;
        this.submitting = false;
      },
      error: (err) => {
        this.ratingError = err.error || 'You already rated this movie';
        this.submitting = false;
      }
    });
  }

  getRatings(movie: any): any[] {
    if (Array.isArray(movie.omdbRatings) && movie.omdbRatings.length) {
      return movie.omdbRatings;
    }
    if (Array.isArray(movie.ratings) && movie.ratings.length) {
      return movie.ratings;
    }
    return [];
  }
} 