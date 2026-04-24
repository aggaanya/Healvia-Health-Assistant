package com.healthvia.backend.exception;


//When user email is not found

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
