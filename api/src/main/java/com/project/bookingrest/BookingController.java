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

    private final BookingRepository bookingRepository;
    private final BookingResourceAssembler bookingResourceAssembler;

    /**
     *
     * @param bookingRepository
     * @param bookingResourceAssembler
     */
    BookingController(BookingRepository bookingRepository, BookingResourceAssembler bookingResourceAssembler){
        this.bookingRepository = bookingRepository;
        this.bookingResourceAssembler = bookingResourceAssembler;
    }

    /**
     *
     * @return
     */
    @GetMapping (value = "/reservas", produces = "application/json; charset=UTF-8")
    public Resources<Resource<Booking>> allBookings (){

        List<Resource<Booking>> bookings_resource;
        List<Booking> bookings;

        bookings = bookingRepository.findAll();

        bookings_resource = bookings.stream()
                .map(bookingResourceAssembler::toResource)
                .collect(Collectors.toList());

        return new Resources<>(bookings_resource,
                linkTo(methodOn(BookingController.class).allBookings()).withSelfRel());

    }

    /**
     * Select Booking
     * @param idBooking
     * @return
     */
    @GetMapping(value = "/reservas/{idBooking}", produces = "application/json; charset=UTF-8")
    Resource<Booking> oneBooking (@PathVariable Long idBooking){

        Booking booking = bookingRepository.findById(idBooking)
                .orElseThrow(() -> new BookingNotFoundException(idBooking));

        return bookingResourceAssembler.toResource(booking);
    }

    /**
     *  Create Booking
     * @param newBooking
     * @return
     * @throws URISyntaxException
     */
    @PostMapping("/reservas")
    ResponseEntity<?> newBooking(@RequestBody Booking newBooking) throws URISyntaxException{

        Resource<Booking> resource = bookingResourceAssembler.toResource(bookingRepository.save(newBooking));

        return ResponseEntity
                .created(new URI(resource.getId().expand().getHref()))
                .body(resource);
    }


    /**
     * Delete Booking by Id
     * @param id_booking
     * @return
     */
    @DeleteMapping(value = "/reservas/{id_booking}", produces = "application/json; charset=UTF-8")
    ResponseEntity<?> deleteBooking(@PathVariable Long id_booking){
        bookingRepository.deleteById(id_booking);

        return ResponseEntity.noContent().build();
    }



}
