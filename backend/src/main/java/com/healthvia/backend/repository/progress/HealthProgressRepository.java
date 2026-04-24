package com.healthvia.backend.repository.progress;

import com.healthvia.backend.entity.HealthProgress;
import com.healthvia.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthProgressRepository extends JpaRepository<HealthProgress, Long> {
    //stores the health tracking data , this function Returns all health metrics of a user.
    List<HealthProgress> findByUser(User user);
    Long countDistinctByUserId(Long userId);
    List<HealthProgress> findByUserId(Long userId);
}