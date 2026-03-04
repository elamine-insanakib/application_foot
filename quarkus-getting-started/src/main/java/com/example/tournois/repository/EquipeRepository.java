package com.example.tournois.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import com.example.tournois.entity.Equipe;

@ApplicationScoped
public class EquipeRepository implements PanacheRepository<Equipe> {}