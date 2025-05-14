package com.ratting.movierate.Exceptions;

public class UserFoundException extends RuntimeException{
    public UserFoundException() {
        super("User is exist");
    }
}