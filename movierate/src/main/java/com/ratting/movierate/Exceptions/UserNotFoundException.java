package com.ratting.movierate.Exceptions;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id) {
        super("User with ID " + id + " not found.");
    }
    public UserNotFoundException(String username) {
        super("User with this username"+username+"  not found.");
    }
}
