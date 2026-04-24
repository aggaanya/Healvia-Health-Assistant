package com.healthvia.backend.exception;

//Invalid JWT

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String message) {
        super(message);
    }
}
