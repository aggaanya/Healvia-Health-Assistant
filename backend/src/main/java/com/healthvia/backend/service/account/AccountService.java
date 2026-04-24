package com.healthvia.backend.service.account;


import com.healthvia.backend.dto.account.*;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.InvalidCredentialsException;
import com.healthvia.backend.exception.UserNotFoundException;
import com.healthvia.backend.repository.appointment.AppointmentRepository;
import com.healthvia.backend.repository.document.MedicalDocumentRepository;
import com.healthvia.backend.repository.progress.HealthProgressRepository;
import com.healthvia.backend.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service //marks this as a service layer, contains business logic
@Slf4j //adds logger
@RequiredArgsConstructor //lombok creates constructor for all final fields
public class AccountService implements AccountServiceInterface{

    //fetches/ saves the user
    private final UserRepository userRepository;
    //count appointments
    private final AppointmentRepository appointmentRepository;
    //count reports
    private final MedicalDocumentRepository documentRepository;
    //tracks activity
    private final HealthProgressRepository progressRepository;
    //encrypt passwords
    private final PasswordEncoder passwordEncoder;

    @Override
    //fetches the user from DB, converts the entity to dto, return response
    public ProfileResponseDTO getProfile(Long userId) {
        log.info("fetching profile for the userId: {}", userId);
        User user = getUserOrThrow(userId);
        return mapToProfileDTO(user);
    }

    @Override
    @Transactional
    //fetches the user, updates fields, transaction automatically saves changes
    public ProfileResponseDTO updateProfile(Long userId, UpdateProfileRequestDTO request) {
        log.info("Updating profile for userId: {}", userId);

        User user = getUserOrThrow(userId);

        user.setFullName(request.getName());
        user.setBio(request.getBio());
        user.setProfilePicture(request.getProfilePicture());

        return mapToProfileDTO(user);
    }


    @Override
    //saves the encrypted passwords
    public void changePassword(long userId, ChangePasswordRequestDTO request) {
        log.info("Changing password for userId: {}", userId);

        User user = getUserOrThrow(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        log.info("Password updated successfully for userId: {}", userId);
    }

    @Override
    @Transactional
    //Update user preferences
    public void updatePrivacySettings(Long userId, PrivacySettingsDTO request) {

        log.info("Updating privacy settings for userId: {}", userId);

        User user = getUserOrThrow(userId);

        user.setEmailNotifications(request.getEmailNotifications());
        user.setPushNotifications(request.getPushNotifications());
        user.setWeeklyHealthReports(request.getWeeklyHealthReports());

        log.info("Privacy settings updated for userId: {}", userId);
    }


    @Override
    @Transactional
    public void deleteAccount(Long userId, DeleteAccountRequestDTO request) {

        log.warn("Delete account requested for userId: {}", userId);

        User user = getUserOrThrow(userId);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        userRepository.delete(user);

        log.warn("User account deleted for userId: {}", userId);
    }

    @Override
    //Return user data (basic export)
    public User exportUserData(Long userId, DataExportRequestDTO request) {

        log.info("Exporting user data for userId: {}", userId);

        return getUserOrThrow(userId);
    }

    @Override
    public AccountStatsDTO getAccountStats(Long userId) {

        log.info("Fetching account stats for userId: {}", userId);

        getUserOrThrow(userId); // ensures user exists

        long totalReports = documentRepository.countByUserId(userId);
        long appointments = appointmentRepository.countByUserId(userId);
        long activeDays = progressRepository.countDistinctByUserId(userId);

        int healthScore = calculateHealthScore(totalReports, appointments, activeDays);

        return AccountStatsDTO.builder()
                .totalReports(totalReports)
                .appointments(appointments)
                .activeDays(activeDays)
                .healthScore(healthScore)
                .build();
    }

    private int calculateHealthScore(long reports, long appointments, long activeDays) {

        // Example logic (can be replaced with ML later)
        int score = (int) (reports * 2 + appointments * 3 + activeDays);

        return Math.min(score, 100); // cap at 100
    }
    //this is the builder function, converts the Entity to DTO
    private ProfileResponseDTO mapToProfileDTO(User user) {
        return ProfileResponseDTO.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePicture())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    //this is the function to find the user with the ID, instead of finding the user again and again and writing the code in every function we will just call the method
    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found with email: " + email)).getId();
    }
}
