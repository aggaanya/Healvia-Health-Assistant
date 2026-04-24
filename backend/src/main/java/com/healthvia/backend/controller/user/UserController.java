package com.healthvia.backend.controller.user;

import com.healthvia.backend.dto.user.UpdateUserProfileRequestDTO;
import com.healthvia.backend.dto.user.UserProfileResponseDTO;
import com.healthvia.backend.dto.user.UserSummaryDTO;
import com.healthvia.backend.service.user.UserServiceInterface;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceInterface userService;

    // =========================
    // GET MY PROFILE
    // =========================
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> getMyProfile() {

        UserProfileResponseDTO response = userService.getMyProfile();

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET DASHBOARD SUMMARY
    // =========================
    @GetMapping("/me/summary")
    public ResponseEntity<UserSummaryDTO> getMySummary() {

        UserSummaryDTO response = userService.getMySummary();

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> updateProfile(
            @Valid @RequestBody UpdateUserProfileRequestDTO request) {

        UserProfileResponseDTO response = userService.updateProfile(request);

        return ResponseEntity.ok(response);
    }

    // =========================
    // DELETE ACCOUNT
    // =========================
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount() {

        userService.deleteMyAccount();

        return ResponseEntity.noContent().build();
    }
}