package com.healthvia.backend.service.user;

import com.healthvia.backend.dto.user.UpdateUserProfileRequestDTO;
import com.healthvia.backend.dto.user.UserProfileResponseDTO;
import com.healthvia.backend.dto.user.UserSummaryDTO;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.ResourceNotFoundException;
import com.healthvia.backend.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService implements UserServiceInterface {

    private final UserRepository userRepository;

    private static final String USER_NOT_FOUND = "User not found";

    // =========================
    // GET CURRENT USER (JWT)
    // =========================
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found for email: {}", email);
                    return new ResourceNotFoundException(USER_NOT_FOUND);
                });
    }

    // =========================
    // GET PROFILE
    // =========================
    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseDTO getMyProfile() {

        User user = getCurrentUser();

        log.info("Fetching profile for userId={}, email={}", user.getId(), user.getEmail());

        return mapToProfileDTO(user);
    }

    // =========================
    // GET SUMMARY
    // =========================
    @Override
    @Transactional(readOnly = true)
    public UserSummaryDTO getMySummary() {

        User user = getCurrentUser();

        log.info("Fetching summary for userId={}", user.getId());

        return UserSummaryDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    @Override
    public UserProfileResponseDTO updateProfile(UpdateUserProfileRequestDTO request) {

        User user = getCurrentUser();

        log.info("Updating profile for userId={}", user.getId());

        // Null-safe updates (IMPORTANT)
        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }

        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        log.info("Profile updated successfully for userId={}", user.getId());

        return mapToProfileDTO(user);
    }

    // =========================
    // DELETE ACCOUNT
    // =========================
    @Override
    public void deleteMyAccount() {

        User user = getCurrentUser();

        log.warn("Deleting account for userId={}, email={}", user.getId(), user.getEmail());

        userRepository.delete(user);

        log.warn("Account deleted for userId={}", user.getId());
    }

    // =========================
    // MAPPER
    // =========================
    private UserProfileResponseDTO mapToProfileDTO(User user) {
        return UserProfileResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .age(user.getAge())
                .gender(user.getGender())
                .build();
    }
}