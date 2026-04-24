package com.healthvia.backend.exception;


//When email already exists during registration

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
