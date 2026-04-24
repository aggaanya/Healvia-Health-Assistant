package com.healthvia.backend.service.auth;

//User Registration
//User Login
//JWT Token Generation
//Token Validation
//Logout
//Refresh Token

//AuthService is a service interface responsible for handling authentication and authorization logic of the application.
//INTERFACE = defines contract

import com.healthvia.backend.dto.auth.*;


public interface AuthServiceInterface {

    AuthResponseDTO register(RegistrationRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
    AuthResponseDTO refreshToken(RefreshTokenRequestDTO request);
    void logout(Long userId);
}


//Frontend (Login/Register)
//        │
//        ▼
//AuthController
//        │
//        ▼
//AuthService (Interface)
//        │
//        ▼
//AuthServiceImpl (Business Logic)
//        │
//        ▼
//UserRepository
//        │
//        ▼
//Database