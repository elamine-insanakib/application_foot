package com.example.tournois.resource;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import com.example.tournois.service.TournoiService;
import com.example.tournois.entity.Tournoi;
import java.util.List;

@Path("/tournois")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TournoiController {

    @Inject
    TournoiService service;

    @GET
    public List<Tournoi> getAll() { return service.getAll(); }

    @POST
    public void create(Tournoi t) { service.create(t); }
}