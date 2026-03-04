package com.example.tournois.resource;

import com.example.tournois.entity.Match;
import com.example.tournois.service.MatchService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/matchs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MatchController {

    @Inject
    MatchService matchService;

    @GET
    public List<Match> getAllMatchs() {
        return matchService.getAllMatchs();
    }

    @GET
    @Path("/{id}")
    public Response getMatchById(@PathParam("id") Long id) {
        return matchService.getMatchById(id)
                .map(m -> Response.ok(m).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response createMatch(Match match) {
        System.out.println("[MatchController] POST /matchs payload=" + match);
        Match saved = matchService.createMatch(match);
        return Response.status(Response.Status.CREATED).entity(saved).build();
    }

    @PUT
    @Path("/{id}")
    public Match updateMatch(@PathParam("id") Long id, Match match) {
        return matchService.updateMatch(id, match);
    }

    @DELETE
    @Path("/{id}")
    public Response deleteMatch(@PathParam("id") Long id) {
        boolean deleted = matchService.deleteMatch(id);
        return deleted ? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build();
    }
}