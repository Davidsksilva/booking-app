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

    private final ClientRepository clientRepository;
    private final BookingRepository bookingRepository;

    private final ClientResourceAssembler clientResourceAssembler;

    /**
     *
     * @param clientRepository
     * @param bookingRepository
     * @param clientResourceAssembler
     */
    ClientController(ClientRepository clientRepository, BookingRepository bookingRepository, ClientResourceAssembler clientResourceAssembler){
        this.clientRepository = clientRepository;
        this.bookingRepository = bookingRepository;
        this.clientResourceAssembler = clientResourceAssembler;
    }

    /**
     *
     * @param client
     * @param hotelId
     * @param bedroomNum
     * @throws IOException
     */
    private void postClientToHotel(Client client, Long hotelId, int bedroomNum) throws IOException {

        String       postUrl       = "http://localhost:9090/hotel/" + hotelId + "/quartos/" + bedroomNum;// put in your url

        sendPost(postUrl, client);

    }

    /**
     *
     * @param postUrl
     * @param object
     * @param <T>
     * @throws IOException
     */
    private <T> void sendPost(String postUrl, T object) throws  IOException{
        Gson         gson          = new Gson();
        HttpClient   httpClient    = HttpClientBuilder.create().build();
        HttpPost     post          = new HttpPost(postUrl);
        StringEntity postingString = new StringEntity(gson.toJson(object));//gson.tojson() converts your pojo to json

        post.setEntity(postingString);
        post.setHeader("Content-Type", "application/json");

        HttpResponse  response = httpClient.execute(post);
    }

    /**
     *
     * @param client
     * @param flightId
     * @throws IOException
     */
    private void postClientToFlight(Client client, Long flightId) throws IOException{

        String       postUrl       = "http://localhost:8080/voos/" + flightId;// put in your url

        sendPost(postUrl, client);
    }

    /**
     *
     * @return
     */
    @GetMapping(value = "/clientes", produces = "application/json; charset=UTF-8")
    public Resources<Resource<Client>> allClients (){
        List<Resource<Client>> clients_resource;
        List<Client> clients;

        clients = clientRepository.findAll();
        clients_resource = clients.stream()
                .map(clientResourceAssembler::toResource)
                .collect(Collectors.toList());
        return new Resources<>(clients_resource,
                linkTo(methodOn(ClientController.class).allClients()).withSelfRel());
    }

    /**
     *
     * @param idClient
     * @return
     */
    @GetMapping(value = "/clientes/{idClient}", produces = "application/json; charset=UTF-8")
    public Resource<Client> oneClient (@PathVariable Long idClient){
        Client client = clientRepository.findById(idClient)
                .orElseThrow(() -> new ClientNotFoundException(idClient));

        return clientResourceAssembler.toResource(client);
    }

    /**
     * Create Booking
     * @param newClient
     * @param idBooking
     * @return
     * @throws URISyntaxException
     * @throws IOException
     */
    @PostMapping("/reservas/{idBooking}")
    ResponseEntity<?> newClientWithBooking(@RequestBody Client newClient,@PathVariable Long idBooking) throws URISyntaxException, IOException {

        Booking booking = bookingRepository.findById(idBooking)
                .orElseThrow(() -> new BookingNotFoundException(idBooking));

        newClient.setBooking(booking);
        Resource<Client> resource = clientResourceAssembler.toResource(clientRepository.save(newClient));

        postClientToHotel(newClient, booking.getHotelId(), booking.getBedroomNum());
        postClientToFlight(newClient, booking.getFlightId());
        
        return ResponseEntity
                .created(new URI(resource.getId().expand().getHref()))
                .body(resource);
    }


}
