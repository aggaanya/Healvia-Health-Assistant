package com.healthvia.backend.exception;

//Invalid request data

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
