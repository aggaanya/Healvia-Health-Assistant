package com.healthvia.backend.dto.common;


import lombok.*;

@Data
@Builder
public class ApiResponseDTO<T> {

    private boolean success;

    private String message;

    private T data;

}