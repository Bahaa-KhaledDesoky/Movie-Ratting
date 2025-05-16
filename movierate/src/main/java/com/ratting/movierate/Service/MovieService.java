package com.ratting.movierate.Service;

import com.ratting.movierate.DTOs.MovieRespond;
import com.ratting.movierate.DTOs.SearchOmdbRespond;
import com.ratting.movierate.Model.Movie;

import java.util.List;

public interface MovieService {
    public MovieRespond getMovie(Long id);
    public Integer getNumberOfMovies();
    public List<MovieRespond> getMovieByTitleDBUsingLike(String title);
    public Movie getMoviefromOmdb(String title);
    public SearchOmdbRespond searchFormMovieOnOmdb(String title,Integer page);
    public List<MovieRespond> getMoviesPage(Integer page);
    public Long deleteMovie(Long id);
    public void deleteMovies(List<Long> movieIds);
    public Long addMovie(Movie request);
    public boolean existMovie(String title);

}
