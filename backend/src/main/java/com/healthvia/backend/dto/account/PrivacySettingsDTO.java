
package com.healthvia.backend.dto.account;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySettingsDTO {

    @NotNull(message = "Email notification preference is required")
    private Boolean emailNotifications;

    @NotNull(message = "Push notification preference is required")
    private Boolean pushNotifications;

    @NotNull(message = "Weekly health report preference is required")
    private Boolean weeklyHealthReports;
}