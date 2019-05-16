package com.project.bookingrest;

import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import com.google.gson.Gson;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@RestController
public class ClientController {

    private final ClientRepository client_repo;
    private final BookingRepository booking_repo;

    private final ClientResourceAssembler client_assembler;
    ClientController(ClientRepository client_repo, BookingRepository booking_repo, ClientResourceAssembler client_assembler){
        this.client_repo = client_repo;
        this.booking_repo =booking_repo;
        this.client_assembler = client_assembler;
    }

    private void postClientToHotel(Client client, Long hotelId, int bedroomNum) throws IOException {

        String       postUrl       = "http://localhost:9090/hotel/" + hotelId + "/quartos/" + bedroomNum;// put in your url

        sendPost(postUrl, client);

    }

    private <T> void sendPost(String postUrl, T object) throws  IOException{
        Gson         gson          = new Gson();
        HttpClient   httpClient    = HttpClientBuilder.create().build();
        HttpPost     post          = new HttpPost(postUrl);
        StringEntity postingString = new StringEntity(gson.toJson(object));//gson.tojson() converts your pojo to json
        post.setEntity(postingString);
        post.setHeader("Content-Type", "application/json");
        HttpResponse  response = httpClient.execute(post);
    }

    private void postClientToFlight(Client client, Long flightId) throws IOException{

        String       postUrl       = "http://localhost:8080/voos/" + flightId;// put in your url

        sendPost(postUrl, client);
    }

    @GetMapping(value = "/clientes", produces = "application/json; charset=UTF-8")
    public Resources<Resource<Client>> allClients (){
        List<Resource<Client>> clients_resource;
        List<Client> clients;

        clients = client_repo.findAll();
        clients_resource = clients.stream()
                .map(client_assembler::toResource)
                .collect(Collectors.toList());
        return new Resources<>(clients_resource,
                linkTo(methodOn(ClientController.class).allClients()).withSelfRel());
    }

    @GetMapping(value = "/clientes/{id_client}", produces = "application/json; charset=UTF-8")
    public Resource<Client> oneClient (@PathVariable Long id_client){
        Client client = client_repo.findById(id_client)
                .orElseThrow(() -> new ClientNotFoundException(id_client));

        return client_assembler.toResource(client);
    }

    // Create Booking
    @PostMapping("/reservas/{id_booking}")
    ResponseEntity<?> newClientWithBooking(@RequestBody Client newClient,@PathVariable Long id_booking) throws URISyntaxException, IOException {

        Booking booking = booking_repo.findById(id_booking)
                .orElseThrow(() -> new BookingNotFoundException(id_booking));

        newClient.setBooking(booking);
        Resource<Client> resource = client_assembler.toResource(client_repo.save(newClient));

        postClientToHotel(newClient, booking.getHotelId(), booking.getBedroomNum());
        postClientToFlight(newClient, booking.getFlightId());
        
        return ResponseEntity
                .created(new URI(resource.getId().expand().getHref()))
                .body(resource);
    }


}
