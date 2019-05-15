package com.project.bookingrest;

import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@RestController
public class BookingController {

    private final BookingRepository booking_repo;
    private final BookingResourceAssembler booking_assembler;

    BookingController(BookingRepository booking_repo, BookingResourceAssembler booking_assembler){
        this.booking_repo = booking_repo;
        this.booking_assembler = booking_assembler;
    }

    @GetMapping (value = "/reservas", produces = "application/json; charset=UTF-8")
    public Resources<Resource<Booking>> allBookings (){

        List<Resource<Booking>> bookings_resource;
        List<Booking> bookings;

        bookings = booking_repo.findAll();

        bookings_resource = bookings.stream()
                .map(booking_assembler::toResource)
                .collect(Collectors.toList());

        return new Resources<>(bookings_resource,
                linkTo(methodOn(BookingController.class).allBookings()).withSelfRel());

    }

    // Select Booking
    @GetMapping(value = "/reservas/{id_booking}", produces = "application/json; charset=UTF-8")
    Resource<Booking> oneBooking (@PathVariable Long id_booking){

        Booking booking = booking_repo.findById(id_booking)
                .orElseThrow(() -> new BookingNotFoundException(id_booking));

        return booking_assembler.toResource(booking);
    }

    // Create Booking
    @PostMapping("/reservas")
    ResponseEntity<?> newBooking(@RequestBody Booking newBooking) throws URISyntaxException{

        Resource<Booking> resource = booking_assembler.toResource(booking_repo.save(newBooking));

        return ResponseEntity
                .created(new URI(resource.getId().expand().getHref()))
                .body(resource);
    }


    // Delete Booking by Id
    @DeleteMapping(value = "/reservas/{id_booking}", produces = "application/json; charset=UTF-8")
    ResponseEntity<?> deleteBooking(@PathVariable Long id_booking){
        booking_repo.deleteById(id_booking);

        return ResponseEntity.noContent().build();
    }



}
