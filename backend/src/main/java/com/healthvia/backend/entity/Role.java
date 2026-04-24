package com.healthvia.backend.entity;


public enum Role {

    USER;
    public String getValue() {
        return this.name();
    }
}