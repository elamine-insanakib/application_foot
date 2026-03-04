package com.example.tournois.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import com.example.tournois.repository.TournoiRepository;
import com.example.tournois.entity.Tournoi;
import java.util.List;

@ApplicationScoped
public class TournoiService {

    @Inject
    TournoiRepository tournoiRepo;

    public List<Tournoi> getAll() { return tournoiRepo.listAll(); }

    @Transactional
    public void create(Tournoi t) { tournoiRepo.persist(t); }
}