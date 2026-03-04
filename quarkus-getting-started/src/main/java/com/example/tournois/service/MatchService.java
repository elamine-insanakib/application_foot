package com.example.tournois.service;

import com.example.tournois.entity.Match;
import com.example.tournois.entity.Equipe;
import com.example.tournois.entity.Tournoi;
import com.example.tournois.enums.TypeTournoi;
import com.example.tournois.enums.StatutMatch;
import com.example.tournois.repository.MatchRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class MatchService {

    @Inject
    MatchRepository matchRepository;

    public List<Match> getAll() {
        return matchRepository.listAll();
    }

    public Match getById(Long id) {
        return matchRepository.findById(id);
    }

    @Transactional
    public Match create(Match match) {
        // si le tournoi n'a pas d'id, on tente de le créer
        // traiter les ids zéro comme absence (certains payloads Angular envoient 0)
        if (match.tournoi != null && (match.tournoi.id == null || match.tournoi.id == 0)) {
            Tournoi t = new Tournoi();
            t.nom = match.tournoi.nom;
            t.dateDebut = java.time.LocalDate.now();
            t.type = com.example.tournois.enums.TypeTournoi.CUP; // valeur par défaut
            t.persist();
            match.tournoi = t;
        }

        // équipes
        if (match.equipe1 != null && (match.equipe1.id == null || match.equipe1.id == 0)) {
            Equipe e1 = new Equipe();
            e1.nom = match.equipe1.nom;
            e1.tournoi = match.tournoi;
            e1.persist();
            match.equipe1 = e1;
        }
        if (match.equipe2 != null && (match.equipe2.id == null || match.equipe2.id == 0)) {
            Equipe e2 = new Equipe();
            e2.nom = match.equipe2.nom;
            e2.tournoi = match.tournoi;
            e2.persist();
            match.equipe2 = e2;
        }

        matchRepository.persist(match);
        return match;
    }

    @Transactional
    public Match update(Long id, Match match) {
        Match existing = matchRepository.findById(id);
        if (existing != null) {
            // corriger statut si des buts et statut planifié
            if ((match.score1 != null && match.score1 > 0) || (match.score2 != null && match.score2 > 0)) {
                if (match.statut == StatutMatch.PENDING) {
                    match.statut = StatutMatch.ONGOING;
                }
            }
            // si le tournoi n'a pas d'id, on tente de le créer
            if (match.tournoi != null && (match.tournoi.id == null || match.tournoi.id == 0)) {
                Tournoi t = new Tournoi();
                t.nom = match.tournoi.nom;
                t.dateDebut = java.time.LocalDate.now();
                t.type = TypeTournoi.CUP;
                t.persist();
                match.tournoi = t;
            }
            if (match.equipe1 != null && (match.equipe1.id == null || match.equipe1.id == 0)) {
                Equipe e1 = new Equipe();
                e1.nom = match.equipe1.nom;
                e1.tournoi = match.tournoi;
                e1.persist();
                match.equipe1 = e1;
            }
            if (match.equipe2 != null && (match.equipe2.id == null || match.equipe2.id == 0)) {
                Equipe e2 = new Equipe();
                e2.nom = match.equipe2.nom;
                e2.tournoi = match.tournoi;
                e2.persist();
                match.equipe2 = e2;
            }

            existing.equipe1 = match.equipe1 != null ? match.equipe1 : existing.equipe1;
            existing.equipe2 = match.equipe2 != null ? match.equipe2 : existing.equipe2;
            existing.score1 = match.score1;
            existing.score2 = match.score2;
            existing.statut = match.statut;
        }
        return existing;
    }

    @Transactional
    public void delete(Long id) {
        matchRepository.deleteById(id);
    }

    public List<Match> getAllMatchs() {
        return getAll();
    }

    public Optional<Match> getMatchById(Long id) {
        return Optional.ofNullable(getById(id));
    }

    @Transactional
    public Match createMatch(Match match) {
        return create(match);
    }

    @Transactional
    public Match updateMatch(Long id, Match match) {
        return update(id, match);
    }

    @Transactional
    public boolean deleteMatch(Long id) {
        return matchRepository.deleteById(id);
    }
}