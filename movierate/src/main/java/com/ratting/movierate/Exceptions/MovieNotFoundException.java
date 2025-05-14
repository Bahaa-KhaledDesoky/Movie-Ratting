package com.ratting.movierate.Exceptions;

public class MovieNotFoundException extends RuntimeException{
    public MovieNotFoundException(Long id) {
        super("Movie with ID " + id + " not found.");
    }
    public MovieNotFoundException(String m) {
        super(m);
    }
}
