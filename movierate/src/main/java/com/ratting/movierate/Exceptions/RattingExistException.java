package com.ratting.movierate.Exceptions;

public class RattingExistException extends RuntimeException{
    public RattingExistException()
    {
        super("This user already rate this movie");
    }
}
