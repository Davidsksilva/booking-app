[1mdiff --git a/README.md b/README.md[m
[1mindex 5df2030..e9c0c53 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -27,9 +27,20 @@[m [mPara o funcionamento completo da aplicação é necessário a execução do back[m
 Para subir o container contento o banco de dados:[m
 [m
 ```bash[m
[32m+[m[32mcd /database/[m
 docker-compose up -d[m
 ```[m
 [m
[32m+[m[32mNa primeira execução será necessário criar o banco de dados das aplicações, para isto é preciso acessar o mysql dentro do docker:[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32mdocker exec -it database_db_1 bash[m
[32m+[m[32mmysql[m
[32m+[m[32mcreate database db_hotel;[m
[32m+[m[32mcreate database db_flight;[m
[32m+[m[32mcreate database db_booking;[m
[32m+[m[32m```[m
[32m+[m
 Para a execução do back-end:[m
 [m
 ```bash[m
[1mdiff --git a/api/src/main/java/com/project/bookingrest/BookingController.java b/api/src/main/java/com/project/bookingrest/BookingController.java[m
[1mindex beaea89..a12cc35 100644[m
[1m--- a/api/src/main/java/com/project/bookingrest/BookingController.java[m
[1m+++ b/api/src/main/java/com/project/bookingrest/BookingController.java[m
[36m@@ -16,33 +16,24 @@[m [mimport static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;[m
 @RestController[m
 public class BookingController {[m
 [m
[31m-    private final BookingRepository bookingRepository;[m
[31m-    private final BookingResourceAssembler bookingResourceAssembler;[m
[31m-[m
[31m-    /**[m
[31m-     *[m
[31m-     * @param bookingRepository[m
[31m-     * @param bookingResourceAssembler[m
[31m-     */[m
[31m-    BookingController(BookingRepository bookingRepository, BookingResourceAssembler bookingResourceAssembler){[m
[31m-        this.bookingRepository = bookingRepository;[m
[31m-        this.bookingResourceAssembler = bookingResourceAssembler;[m
[32m+[m[32m    private final BookingRepository booking_repo;[m
[32m+[m[32m    private final BookingResourceAssembler booking_assembler;[m
[32m+[m
[32m+[m[32m    BookingController(BookingRepository booking_repo, BookingResourceAssembler booking_assembler){[m
[32m+[m[32m        this.booking_repo = booking_repo;[m
[32m+[m[32m        this.booking_assembler = booking_assembler;[m
     }[m
 [m
[31m-    /**[m
[31m-     *[m
[31m-     * @return[m
[31m-     */[m
     @GetMapping (value = "/reservas", produces = "application/json; charset=UTF-8")[m
     public Resources<Resource<Booking>> allBookings (){[m
 [m
         List<Resource<Booking>> bookings_resource;[m
         List<Booking> bookings;[m
 [m
[31m-        bookings = bookingRepository.findAll();[m
[32m+[m[32m        bookings = booking_repo.findAll();[m
 [m
         bookings_resource = bookings.stream()[m
[31m-                .map(bookingResourceAssembler::toResource)[m
[32m+[m[32m                .map(booking_assembler::toResource)[m
                 .collect(Collectors.toList());[m
 [m
         return new Resources<>(bookings_resource,[m
[36m@@ -50,30 +41,21 @@[m [mpublic class BookingController {[m
 [m
     }[m
 [m
[31m-    /**[m
[31m-     * Select Booking[m
[31m-     * @param idBooking[m
[31m-     * @return[m
[31m-     */[m
[31m-    @GetMapping(value = "/reservas/{idBooking}", produces = "application/json; charset=UTF-8")[m
[31m-    Resource<Booking> oneBooking (@PathVariable Long idBooking){[m
[32m+[m[32m    // Select Booking[m
[32m+[m[32m    @GetMapping(value = "/reservas/{id_booking}", produces = "application/json; charset=UTF-8")[m
[32m+[m[32m    Resource<Booking> oneBooking (@PathVariable Long id_booking){[m
 [m
[31m-        Booking booking = bookingRepository.findById(idBooking)[m
[31m-                .orElseThrow(() -> new BookingNotFoundException(idBooking));[m
[32m+[m[32m        Booking booking = booking_repo.findById(id_booking)[m
[32m+[m[32m                .orElseThrow(() -> new BookingNotFoundException(id_booking));[m
 [m
[31m-        return bookingResourceAssembler.toResource(booking);[m
[32m+[m[32m        return booking_assembler.toResource(booking);[m
     }[m
 [m
[31m-    /**[m
[31m-     *  Create Booking[m
[31m-     * @param newBooking[m
[31m-     * @return[m
[31m-     * @throws URISyntaxException[m
[31m-     */[m
[32m+[m[32m    // Create Booking[m
     @PostMapping("/reservas")[m
     ResponseEntity<?> newBooking(@RequestBody Booking newBooking) throws URISyntaxException{[m
 [m
[31m-        Resource<Booking> resource = bookingResourceAssembler.toResource(bookingRepository.save(newBooking));[m
[32m+[m[32m        Resource<Booking> resource = booking_assembler.toResource(booking_repo.save(newBooking));[m
 [m
         return ResponseEntity[m
                 .created(new URI(resource.getId().expand().getHref()))[m
[36m@@ -81,14 +63,10 @@[m [mpublic class BookingController {[m
     }[m
 [m
 [m
[31m-    /**[m
[31m-     * Delete Booking by Id[m
[31m-     * @param id_booking[m
[31m-     * @return[m
[31m-     */[m
[32m+[m[32m    // Delete Booking by Id[m
     @DeleteMapping(value = "/reservas/{id_booking}", produces = "application/json; charset=UTF-8")[m
     ResponseEntity<?> deleteBooking(@PathVariable Long id_booking){[m
[31m-        bookingRepository.deleteById(id_booking);[m
[32m+[m[32m        booking_repo.deleteById(id_booking);[m
 [m
         return ResponseEntity.noContent().build();[m
     }[m
[1mdiff --git a/api/src/main/java/com/project/bookingrest/ClientController.java b/api/src/main/java/com/project/bookingrest/ClientController.java[m
[1mindex 836213a..25ea1b4 100644[m
[1m--- a/api/src/main/java/com/project/bookingrest/ClientController.java[m
[1m+++ b/api/src/main/java/com/project/bookingrest/ClientController.java[m
[36m@@ -11,6 +11,7 @@[m [mimport java.net.URISyntaxException;[m
 import java.util.List;[m
 import java.util.stream.Collectors;[m
 [m
[32m+[m[32mimport org.apache.http.HttpEntity;[m
 import org.apache.http.HttpResponse;[m
 import org.apache.http.client.HttpClient;[m
 import org.apache.http.client.methods.HttpPost;[m
[36m@@ -24,30 +25,16 @@[m [mimport static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;[m
 @RestController[m
 public class ClientController {[m
 [m
[31m-    private final ClientRepository clientRepository;[m
[31m-    private final BookingRepository bookingRepository;[m
[31m-[m
[31m-    private final ClientResourceAssembler clientResourceAssembler;[m
[31m-[m
[31m-    /**[m
[31m-     *[m
[31m-     * @param clientRepository[m
[31m-     * @param bookingRepository[m
[31m-     * @param clientResourceAssembler[m
[31m-     */[m
[31m-    ClientController(ClientRepository clientRepository, BookingRepository bookingRepository, ClientResourceAssembler clientResourceAssembler){[m
[31m-        this.clientRepository = clientRepository;[m
[31m-        this.bookingRepository = bookingRepository;[m
[31m-        this.clientResourceAssembler = clientResourceAssembler;[m
[32m+[m[32m    private final ClientRepository client_repo;[m
[32m+[m[32m    private final BookingRepository booking_repo;[m
[32m+[m
[32m+[m[32m    private final ClientResourceAssembler client_assembler;[m
[32m+[m[32m    ClientController(ClientRepository client_repo, BookingRepository booking_repo, ClientResourceAssembler client_assembler){[m
[32m+[m[32m        this.client_repo = client_repo;[m
[32m+[m[32m        this.booking_repo =booking_repo;[m
[32m+[m[32m        this.client_assembler = client_assembler;[m
     }[m
 [m
[31m-    /**[m
[31m-     *[m
[31m-     * @param client[m
[31m-     * @param hotelId[m
[31m-     * @param bedroomNum[m
[31m-     * @throws IOException[m
[31m-     */[m
     private void postClientToHotel(Client client, Long hotelId, int bedroomNum) throws IOException {[m
 [m
         String       postUrl       = "http://localhost:9090/hotel/" + hotelId + "/quartos/" + bedroomNum;// put in your url[m
[36m@@ -56,13 +43,6 @@[m [mpublic class ClientController {[m
 [m
     }[m
 [m
[31m-    /**[m
[31m-     *[m
[31m-     * @param postUrl[m
[31m-     * @param object[m
[31m-     * @param <T>[m
[31m-     * @throws IOException[m
[31m-     */[m
     private <T> void sendPost(String postUrl, T object) throws  IOException{[m
         Gson         gson          = new Gson();[m
         HttpClient   httpClient    = HttpClientBuilder.create().build();[m
[36m@@ -75,12 +55,6 @@[m [mpublic class ClientController {[m
         HttpResponse  response = httpClient.execute(post);[m
     }[m
 [m
[31m-    /**[m
[31m-     *[m
[31m-     * @param client[m
[31m-     * @param flightId[m
[31m-     * @throws IOException[m
[31m-     */[m
     private void postClientToFlight(Client client, Long flightId) throws IOException{[m
 [m
         String       postUrl       = "http://localhost:8080/voos/" + flightId;// put in your url[m
[36m@@ -88,52 +62,36 @@[m [mpublic class ClientController {[m
         sendPost(postUrl, client);[m
     }[m
 [m
[31m-    /**[m
[31m-     *[m
[31m-     * @return[m
[31m-     */[m
     @GetMapping(value = "/clientes", produces = "application/json; charset=UTF-8")[m
     public Resources<Resource<Client>> allClients (){[m
         List<Resource<Client>> clients_resource;[m
         List<Client> clients;[m
 [m
[31m-        clients = clientRepository.findAll();[m
[32m+[m[32m        clients = client_repo.findAll();[m
         clients_resource = clients.stream()[m
[31m-                .map(clientResourceAssembler::toResource)[m
[32m+[m[32m                .map(client_assembler::toResource)[m
                 .collect(Collectors.toList());[m
         return new Resources<>(clients_resource,[m
                 linkTo(methodOn(ClientController.class).allClients()).withSelfRel());[m
     }[m
 [m
[31m-    /**[m
[31m-     *[m
[31m-     * @param idClient[m
[31m-     * @return[m
[31m-     */[m
[31m-    @GetMapping(value = "/clientes/{idClient}", produces = "application/json; charset=UTF-8")[m
[31m-    public Resource<Client> oneClient (@PathVariable Long idClient){[m
[31m-        Client client = clientRepository.findById(idClient)[m
[31m-                .orElseThrow(() -> new ClientNotFoundException(idClient));[m
[31m-[m
[31m-        return clientResourceAssembler.toResource(client);[m
[32m+[m[32m    @GetMapping(value = "/clientes/{id_client}", produces = "application/json; charset=UTF-8")[m
[32m+[m[32m    public Resource<Client> oneClient (@PathVariable Long id_client){[m
[32m+[m[32m        Client client = client_repo.findById(id_client)[m
[32m+[m[32m                .orElseThrow(() -> new ClientNotFoundException(id_client));[m
[32m+[m
[32m+[m[32m        return client_assembler.toResource(client);[m
     }[m
 [m
[31m-    /**[m
[31m-     * Create Booking[m
[31m-     * @param newClient[m
[31m-     * @param idBooking[m
[31m-     * @return[m
[31m-     * @throws URISyntaxException[m
[31m-     * @throws IOException[m
[31m-     */[m
[31m-    @PostMapping("/reservas/{idBooking}")[m
[31m-    ResponseEntity<?> newClientWithBooking(@RequestBody Client newClient,@PathVariable Long idBooking) throws URISyntaxException, IOException {[m
[32m+[m[32m    // Create Booking[m
[32m+[m[32m    @PostMapping("/reservas/{id_booking}")[m
[32m+[m[32m    ResponseEntity<?> newClientWithBooking(@RequestBody Client newClient,@PathVariable Long id_booking) throws URISyntaxException, IOException {[m
 [m
[31m-        Booking booking = bookingRepository.findById(idBooking)[m
[31m-                .orElseThrow(() -> new BookingNotFoundException(idBooking));[m
[32m+[m[32m        Booking booking = booking_repo.findById(id_booking)[m
[32m+[m[32m                .orElseThrow(() -> new BookingNotFoundException(id_booking));[m
 [m
         newClient.setBooking(booking);[m
[31m-        Resource<Client> resource = clientResourceAssembler.toResource(clientRepository.save(newClient));[m
[32m+[m[32m        Resource<Client> resource = client_assembler.toResource(client_repo.save(newClient));[m
 [m
         postClientToHotel(newClient, booking.getHotelId(), booking.getBedroomNum());[m
         postClientToFlight(newClient, booking.getFlightId());[m
[1mdiff --git a/api/src/main/java/com/project/bookingrest/WebConfig.java b/api/src/main/java/com/project/bookingrest/WebConfig.java[m
[1mindex f71fb38..bc0c9d2 100644[m
[1m--- a/api/src/main/java/com/project/bookingrest/WebConfig.java[m
[1m+++ b/api/src/main/java/com/project/bookingrest/WebConfig.java[m
[36m@@ -7,7 +7,7 @@[m [mimport org.springframework.web.servlet.config.annotation.WebMvcConfigurer;[m
 import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;[m
 [m
 @Configuration[m
[31m-// Class to enable CORS[m
[32m+[m
 public class WebConfig implements WebMvcConfigurer {[m
     @Override[m
     public void addCorsMappings(CorsRegistry registry) {[m
[1mdiff --git a/api/src/main/java/com/project/bookingrest/WebSecurityConfiguration.java b/api/src/main/java/com/project/bookingrest/WebSecurityConfiguration.java[m
[1mindex 391660f..c149366 100644[m
[1m--- a/api/src/main/java/com/project/bookingrest/WebSecurityConfiguration.java[m
[1m+++ b/api/src/main/java/com/project/bookingrest/WebSecurityConfiguration.java[m
[36m@@ -5,7 +5,6 @@[m [mimport org.springframework.security.config.annotation.web.builders.HttpSecurity;[m
 import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;[m
 [m
 @Configuration[m
[31m-// Class to enable requests on all Endpoints[m
 public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {[m
 [m
     @Override[m
[36m@@ -13,5 +12,6 @@[m [mpublic class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {[m
         http.csrf().disable();[m
         http.authorizeRequests()[m
                 .antMatchers("/**").permitAll();[m
[32m+[m[32m        //httpSecurity.requestMatchers().antMatchers("/hotels").permitAll();[m
     }[m
 }[m
\ No newline at end of file[m
