package com.example.tournois.resource;

import com.example.tournois.entity.Equipe;
import com.example.tournois.service.EquipeService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/equipes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EquipeController {

    @Inject
    EquipeService equipeService;

    @GET
    public List<Equipe> getAllEquipes() {
        return equipeService.getAllEquipes();
    }

    @GET
    @Path("/{id}")
    public Response getEquipeById(@PathParam("id") Long id) {
        return equipeService.getEquipeById(id)
                .map(e -> Response.ok(e).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Equipe createEquipe(Equipe equipe) {
        return equipeService.createEquipe(equipe);
    }

    @PUT
    @Path("/{id}")
    public Equipe updateEquipe(@PathParam("id") Long id, Equipe equipe) {
        return equipeService.updateEquipe(id, equipe);
    }

    @DELETE
    @Path("/{id}")
    public Response deleteEquipe(@PathParam("id") Long id) {
        boolean deleted = equipeService.deleteEquipe(id);
        return deleted ? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build();
    }
}
