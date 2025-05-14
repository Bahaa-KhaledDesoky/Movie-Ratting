package com.ratting.movierate.Exceptions;

public class MovieExistFoundException extends RuntimeException{
    public MovieExistFoundException() {

        super("This Movie is already Exist");

    }
}
