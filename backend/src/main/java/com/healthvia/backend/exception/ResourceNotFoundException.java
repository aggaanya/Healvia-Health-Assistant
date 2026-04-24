package com.healthvia.backend.exception;


//Generic entity not found

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
