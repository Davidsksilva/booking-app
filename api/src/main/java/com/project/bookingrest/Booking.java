package com.project.bookingrest;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class Booking {

    private @Id @GeneratedValue Long id;

    private Long hotelId;
    private int bedroomNum;

    private Long flightId;

    public Booking(){

    }

    public Booking(Long hotelId, int bedroomNum, Long flightId){
        this.hotelId = hotelId;
        this.bedroomNum = bedroomNum;
        this.flightId = flightId;
    }
}
