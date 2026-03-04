package com.example.tournois.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
public class Equipe extends PanacheEntityBase {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String nom;

    @ManyToOne
    @JoinColumn(name="tournoi_id", nullable=false)
    public Tournoi tournoi;
}
