package com.example.tournois.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import com.example.tournois.enums.TypeTournoi;

@Entity
public class Tournoi extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    @NotBlank
    public String nom;

    @Column(nullable = false)
    public LocalDate dateDebut;

    @Column
    public LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public TypeTournoi type;
}