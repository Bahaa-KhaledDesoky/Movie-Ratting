package com.ratting.movierate.Exceptions;

public class WrongPasswordException extends RuntimeException{
    public WrongPasswordException(){
        super("wrong password");
    }
}
