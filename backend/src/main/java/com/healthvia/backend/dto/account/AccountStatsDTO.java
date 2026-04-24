package com.healthvia.backend.dto.account;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountStatsDTO {

    private Long totalReports;

    private Long appointments;

    private Long activeDays;

    private Integer healthScore;
}

//Frontend Account Page
//        │
//        ▼
//GET /api/account/stats
//        │
//        ▼
//AccountController
//        │
//        ▼
//AccountService
//        │
//        ▼
//Repositories
//   ├ MedicalDocumentRepository → totalReports
//   ├ AppointmentRepository → appointments
//   ├ HealthProgressRepository → activeDays
//   └ HealthProgressRepository → healthScore