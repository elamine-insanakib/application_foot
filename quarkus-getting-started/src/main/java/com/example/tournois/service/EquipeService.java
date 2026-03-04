package com.example.tournois.service;

import com.example.tournois.entity.Equipe;
import com.example.tournois.repository.EquipeRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EquipeService {

    @Inject
    EquipeRepository equipeRepository;

    public List<Equipe> getAll() {
        return equipeRepository.listAll();
    }

    public Equipe getById(Long id) {
        return equipeRepository.findById(id);
    }

    @Transactional
    public Equipe create(Equipe equipe) {
        equipeRepository.persist(equipe);
        return equipe;
    }

    @Transactional
    public Equipe update(Long id, Equipe equipe) {
        Equipe existing = equipeRepository.findById(id);
        if (existing != null) {
            existing.nom = equipe.nom;
        }
        return existing;
    }

    @Transactional
    public void delete(Long id) {
        equipeRepository.deleteById(id);
    }

    public List<Equipe> getAllEquipes() {
        return getAll();
    }

    public Optional<Equipe> getEquipeById(Long id) {
        return Optional.ofNullable(getById(id));
    }

    @Transactional
    public Equipe createEquipe(Equipe equipe) {
        return create(equipe);
    }

    @Transactional
    public Equipe updateEquipe(Long id, Equipe equipe) {
        return update(id, equipe);
    }

    @Transactional
    public boolean deleteEquipe(Long id) {
        return equipeRepository.deleteById(id);
    }
}