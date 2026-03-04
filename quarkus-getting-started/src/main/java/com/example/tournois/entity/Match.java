package com.example.tournois.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.tournois.enums.StatutMatch;

@Entity
@Table(name="match_jeu")
public class Match extends PanacheEntityBase {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne @JoinColumn(name="equipe1_id", nullable=false)
    public Equipe equipe1;

    @ManyToOne @JoinColumn(name="equipe2_id", nullable=false)
    public Equipe equipe2;

    @ManyToOne @JoinColumn(name="tournoi_id", nullable=false)
    public Tournoi tournoi;

    public Integer score1 = 0;
    public Integer score2 = 0;

    public LocalDateTime dateMatch;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    public StatutMatch statut;
}