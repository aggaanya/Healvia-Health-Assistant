package com.healthvia.backend.repository.user;

import com.healthvia.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


//repository communicate with database, this allow us to perform operations like :: save data, fetch data, update, and delete, without writing sql

//handel user authentication and registration
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //used for the login authentication, and jwt authentication
    Optional<User> findByEmail(String email);

    // Used to check if email already exists during signup
    boolean existsByEmail(String email);

}

//Client (Login Request)
//        ↓
//AuthController
//        ↓
//AuthService
//        ↓
//UserRepository.findByEmail(email)
//        ↓
//User returned
//        ↓
//Password verified
//        ↓
//JWT token generated
//        ↓
//Token sent to frontend
