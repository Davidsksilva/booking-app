package com.project.bookingrest;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class Booking {

    private @Id @GeneratedValue Long id;

    private String hotelName;
    private Long hotelId;
    private int bedroomNum;

    private Long flightId;
    private String flightCode;

    public Booking(){

    }
    public Booking(String hotelName, Long hotelId, int bedroomNum, Long flightId, String flightCode){
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.bedroomNum = bedroomNum;
        this.flightId = flightId;
        this.flightCode = flightCode;
    }
}
