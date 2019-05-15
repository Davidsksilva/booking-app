package com.project.bookingrest;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Client {

    private @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)  Long id;
    private String name;
    private int age;
    private String gender;

    @ManyToOne
    private Booking booking;

    public Client(){

    }

    public Client( String name, int age, String gender, Booking booking){
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.booking = booking;
    }
    public Client( String name, int age, String gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}
