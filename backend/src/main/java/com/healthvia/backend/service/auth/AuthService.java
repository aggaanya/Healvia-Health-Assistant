package com.healthvia.backend.service.auth;

import com.healthvia.backend.dto.auth.AuthResponseDTO;
import com.healthvia.backend.dto.auth.LoginRequestDTO;
import com.healthvia.backend.dto.auth.RefreshTokenRequestDTO;
import com.healthvia.backend.dto.auth.RegistrationRequestDTO;
import com.healthvia.backend.entity.RefreshToken;
import com.healthvia.backend.entity.Role;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.UserAlreadyExistsException;
import com.healthvia.backend.exception.UserNotFoundException;
import com.healthvia.backend.repository.RefreshTokenRepository;
import com.healthvia.backend.repository.user.UserRepository;
//this is the class which is responsible for creating refresh token,creating refresh tokens checking expiration, managing token lifecycle
import com.healthvia.backend.service.token.RefreshTokenService;
//this handel jwt operations generateToken()extractUsername(), validateToken()
import com.healthvia.backend.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor //it creates the constructor
@Slf4j //tracks events in production, adds logger info
public class AuthService implements AuthServiceInterface {

    private final UserRepository userRepository; //database operations for users
    private final PasswordEncoder passwordEncoder; //password hashing
    private final JwtUtility jwtUtility; //JWT token generation
    private final AuthenticationManager authenticationManager; //verifies login credentials
    private final RefreshTokenService refreshTokenService; //manages refresh tokens
    private final RefreshTokenRepository refreshTokenRepository;  //database operations for tokens

    @Override
    //This, creates a new account
    public AuthResponseDTO register(RegistrationRequestDTO request) {
        log.info("register request received for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with this email");
        }
        //user entity gets created
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER) // ✅ FIX HERE
                .build();
        userRepository.save(user);

        log.info("user register successfully: {}", user.getEmail());

        //generate JWT token
        String token = jwtUtility.generateToken(user.getEmail());

        //response in frontend
        //{
        //  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
        //  "userId": 5,
        //  "email": "user@gmail.com",
        //  "role": "PATIENT",
        //  "expiresIn": 3600000
        //}
        return AuthResponseDTO.builder()
                .accessToken(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .expiresIn(jwtUtility.getExpirationTime())
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {

        //spring checks the email and password
        //AuthenticationManager is a core component of Spring Security that is responsible for verifying a user's credentials (authentication).AuthenticationManager checks whether the user's email/username and password are correct.
        authenticationManager.authenticate(
                //UsernamePasswordAuthenticationToken :: represents login credentials
                //Principal: user@gmail.com
                //Credentials: password123
                //Authenticated: false
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        //fetching the user from DB
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        //generating access token
        String accessToken = jwtUtility.generateToken(user.getEmail());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    //generating access token, this is generated when old token expires
    @Override
    public AuthResponseDTO refreshToken(RefreshTokenRequestDTO request) {
        //get token from request
        String requestToken = request.getRefreshToken();
        //finds the token in DB if not found than exception thrown
        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        //if the token expires than it gets deleted from the DB
        refreshTokenService.verifyExpiration(refreshToken);

        //gets the user
        User user = refreshToken.getUser();

        //generate new access token
        String newAccessToken = jwtUtility.generateToken(user.getEmail());

        //return new token
        return AuthResponseDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    //Invalidate refresh tokens
    @Override
    public void logout(Long userId) {
        log.info("Logout requested for userId: {}", userId);
        //finds the user
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        //this removes the refresh token from DB, and user can not create the new token
        refreshTokenRepository.deleteByUser(user);

        log.info("User logged out successfully");
    }
}

