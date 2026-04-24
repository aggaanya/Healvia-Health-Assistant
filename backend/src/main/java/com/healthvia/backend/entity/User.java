package com.healthvia.backend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


//this is the class for the ACCOUNT PAGE/ USER PROFILE
//this file is handel mainly by the user module
@Entity
@Table(name = "users")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //unique user identifier
    private long id;

    @Column(nullable = false)
    //display name on the profile
    private String fullName;

    @Column(unique = true, nullable = false)
    //used for login
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(nullable = false)
    //authentication
    private String password;

    private LocalDate dateOfBirth;

    private String profilePicture;

    private String bio;

    private Boolean emailNotifications;

    private boolean pushNotifications;

    private boolean weeklyHealthReports;

    private String country;

    private String language;

    @Column(nullable = false)
    private String name;

    private String phone;
    private Integer age;
    private String gender;



}
