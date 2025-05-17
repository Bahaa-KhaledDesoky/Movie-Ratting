
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { MoviesListComponent } from './pages/movies/movies-list/movies-list.component';
import { MovieDetailsComponent } from './pages/movies/movie-details/movie-details.component';
import { MovieOmdbSearchComponent } from './pages/movies/movie-omdb-search/movie-omdb-search.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent },
    { path: 'movies', component: MoviesListComponent },
    { path: 'movies/add-omdb', component: MovieOmdbSearchComponent },
    { path: 'movies/:id', component: MovieDetailsComponent }
];