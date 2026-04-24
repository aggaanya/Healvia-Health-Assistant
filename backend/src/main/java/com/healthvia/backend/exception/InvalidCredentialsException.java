package com.healthvia.backend.exception;


//Wrong email or password

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
