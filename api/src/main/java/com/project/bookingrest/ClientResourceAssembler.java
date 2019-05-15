package com.project.bookingrest;

import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@Component
public class ClientResourceAssembler implements ResourceAssembler<Client, Resource<Client>> {
    @Override
    public Resource<Client> toResource(Client client){

        return  new Resource<>(client,
                linkTo(methodOn(ClientController.class).oneClient(client.getId())).withSelfRel(),
                linkTo(methodOn(ClientController.class).allClients()).withRel("clients"));
    }
}
