package com.project.bookingrest;

public class BookingNotFoundException extends RuntimeException {

    BookingNotFoundException(Long id){super("Could not find booking" + id);}
}
