package com.healthvia.backend.service.account;

//accountService is a service interface responsible for handling all business logic related to the user's account management
//it defines operations such as profile management, data explore and dashboard stats
//It defines operations such as profile management, password updates,
//privacy settings, account deletion, data export, and dashboard statistics.
//The interface is implemented by AccountServiceImpl, which contains
//the actual business logic.


import com.healthvia.backend.dto.account.*;

public interface AccountServiceInterface {

    //fetches the user profile data for account page
    ProfileResponseDTO getProfile(Long userId);
    //this function will update name, bio, profile, image
    ProfileResponseDTO updateProfile(Long userId, UpdateProfileRequestDTO request);

    //validate the current password, and update the new password
    void changePassword(long userId, ChangePasswordRequestDTO request);
    //update user privacy and notifications preferences
    void updatePrivacySettings(Long userId, PrivacySettingsDTO request);

    //delete user account permanently
    void deleteAccount(Long userId, DeleteAccountRequestDTO request);

    //download all user-related data
    Object exportUserData(Long userId, DataExportRequestDTO request);
    //return dashboard stas
    AccountStatsDTO getAccountStats(Long userId);
}
