package com.healthvia.backend.service.user;

import com.healthvia.backend.dto.user.UpdateUserProfileRequestDTO;
import com.healthvia.backend.dto.user.UserProfileResponseDTO;
import com.healthvia.backend.dto.user.UserSummaryDTO;

public interface UserServiceInterface {

    // Full profile (My Profile)
    UserProfileResponseDTO getMyProfile();

    // Dashboard summary
    UserSummaryDTO getMySummary();

    // Update user profile
    UserProfileResponseDTO updateProfile(UpdateUserProfileRequestDTO request);

    // Delete account
    void deleteMyAccount();
}
