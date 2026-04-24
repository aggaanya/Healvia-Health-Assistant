package com.healthvia.backend.exception;

//JWT expired

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message) {
        super(message);
    }
}
