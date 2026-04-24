package com.healthvia.backend.repository.reminder;

import com.healthvia.backend.entity.MedicationReminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderRepository extends JpaRepository<MedicationReminder, Long> {

    List<MedicationReminder> findByUserId(Long userId);

}