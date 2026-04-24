package com.healthvia.backend.repository.appointment;

import com.healthvia.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


//through these methods we can automatically save, delete, and perform many operations
//Method	Purpose
//save()	insert/update record
//findById()	find record by id
//findAll()	get all records
//deleteById()	delete record
//count()	count rows
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    //this manages doctor appointments, this function returns all the appointments of the user
    List<Appointment> findByUserId(Long userId);
    long countByUserId(Long userId);
    List<Appointment> findByUser_IdAndAppointmentDateTimeAfter(Long userId, LocalDateTime dateTime);
}

//GET /appointments
//      ↓
//AppointmentController
//      ↓
//AppointmentService
//      ↓
//AppointmentRepository
//      ↓
//MySQL / PostgreSQL