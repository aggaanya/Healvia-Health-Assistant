package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String iconUrl;
    private LocalDate dateEarned;
    private String title;
    private boolean achieved;
}
