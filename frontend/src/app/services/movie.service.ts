import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8081/api/movie';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/getAll`);
  }

  getAllPaged(page: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/getMoviesPage/${page}`);
  }

  getNumberOfMovies(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getNumberOfMovies`);
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/getMovie/${id}`);
  }

  searchByTitle(title: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/getMovieByTitle/${title}`);
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteMovie/${id}`);
  }

  searchOmdb(title: string, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/searchFormMovieOnOmdb/${title}?page=${page}`);
  }
} 