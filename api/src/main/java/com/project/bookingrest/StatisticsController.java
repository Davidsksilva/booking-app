package com.project.bookingrest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatisticsController {

    private final BookingRepository booking_repo;
    private final ClientRepository client_repo;

    StatisticsController(BookingRepository booking_repo, ClientRepository client_repo){
        this.booking_repo = booking_repo;
        this.client_repo = client_repo;
    }

    //@GetMapping(value = "/estatisticas", produces = "application/json; chrset=UTF-8")
   // public List<>
}
