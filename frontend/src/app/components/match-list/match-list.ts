import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatchService, Match } from '../../services/match.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './match-list.html',
  styleUrls: ['./match-list.css']
})
export class MatchListComponent implements OnInit {
  matchs: Match[] = [];
  filteredMatchs: Match[] = [];
  tournois: string[] = [];
  selectedTournoi: string = '';
  currentUser: User | null = null;
  
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Propriétés pour le formulaire admin
  showForm: boolean = false;
  isEditingMode: boolean = false;
  newMatch: Partial<Match> = this.initializeNewMatch();
  editingMatchId: number | null = null;

  constructor(
    private matchService: MatchService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Recharger les matchs quand le rôle change
      this.loadMatches();
    });
  }

  ngOnInit(): void {
    this.loadMatches();
  }

  private loadMatches(): void {
    this.matchService.getAll().subscribe({
      next: data => {
        this.matchs = data;
        this.filteredMatchs = [...this.matchs];
        this.extractTournois();
        this.totalPages = Math.ceil(this.filteredMatchs.length / this.pageSize);
      },
      error: err => console.error('Erreur chargement matchs:', err)
    });
  }

  extractTournois() {
    const set = new Set<string>();
    this.matchs.forEach(m => set.add(m.tournoi.nom));
    this.tournois = Array.from(set);
  }

  filterByTournoi() {
    if (!this.selectedTournoi) {
      this.filteredMatchs = [...this.matchs];
    } else {
      this.filteredMatchs = this.matchs.filter(m => m.tournoi.nom === this.selectedTournoi);
    }
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredMatchs.length / this.pageSize);
  }

  get pagedMatchs(): Match[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredMatchs.slice(start, start + this.pageSize);
  }

  nextPage() { if (this.page < this.totalPages) this.page++; }
  prevPage() { if (this.page > 1) this.page--; }

  getStatusClass(status: string) {
    switch(status) {
      case 'Planifié': return 'status-pending';
      case 'En cours': return 'status-ongoing';
      case 'Terminé': return 'status-finished';
      default: return '';
    }
  }


  switchRole(role: string): void {
    this.authService.login(role as any);
  }

  getRoles() {
    return this.authService.getRoles();
  }


  // ==================== MÉTHODES POUR LE FORMULAIRE ADMIN ====================
  
  initializeNewMatch(): Partial<Match> {
    return {
      equipe1: { id: 0, nom: '' },
      equipe2: { id: 0, nom: '' },
      tournoi: { id: 0, nom: '' },
      score1: 0,
      score2: 0,
      dateMatch: new Date().toISOString(),
      statut: 'Planifié'
    };
  }

  onScoreChange(): void {
    if ((this.newMatch.score1 || 0) > 0 || (this.newMatch.score2 || 0) > 0) {
      if (this.newMatch.statut === 'Planifié') {
        this.newMatch.statut = 'En cours';
      }
    }
  }

  openForm(): void {
    this.showForm = true;
    this.isEditingMode = false;
    this.newMatch = this.initializeNewMatch();
    this.editingMatchId = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.newMatch = this.initializeNewMatch();
    this.editingMatchId = null;
  }

  editMatch(match: Match): void {
    this.newMatch = { ...match };
    this.isEditingMode = true;
    this.editingMatchId = match.id;
    this.showForm = true;
  }

  saveMatch(): void {
    console.log('Saving match', this.newMatch);
    if (!this.newMatch.equipe1?.nom || !this.newMatch.equipe2?.nom || !this.newMatch.tournoi?.nom) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditingMode && this.editingMatchId) {
      const payload: Match = {
        id: this.editingMatchId,
        equipe1: this.newMatch.equipe1!,
        equipe2: this.newMatch.equipe2!,
        tournoi: this.newMatch.tournoi!,
        score1: this.newMatch.score1 || 0,
        score2: this.newMatch.score2 || 0,
        dateMatch: this.newMatch.dateMatch!,
        statut: this.newMatch.statut || 'Planifié'
      };

      this.matchService.updateMatch(payload).subscribe({
        next: updated => {
          this.loadMatches();
          this.closeForm();
        },
        error: err => {
          console.error('Erreur mise à jour match:', err);
          alert('Impossible de mettre à jour le match.');
          // appliquer localement pour que l'utilisateur voie la modification
          const index = this.matchs.findIndex(m => m.id === this.editingMatchId);
          if (index !== -1) {
            this.matchs[index] = payload;
            this.filteredMatchs = [...this.matchs];
            this.extractTournois();
          }
          this.closeForm();
        }
      });
    } else {
      const payload: Match = {
        id: 0, // backend générera l'id
        equipe1: { ...this.newMatch.equipe1! },
        equipe2: { ...this.newMatch.equipe2! },
        tournoi: { ...this.newMatch.tournoi! },
        score1: this.newMatch.score1 || 0,
        score2: this.newMatch.score2 || 0,
        dateMatch: this.newMatch.dateMatch!,
        statut: this.newMatch.statut || 'Planifié'
      };
      // si des buts sont saisis et qu'on est en planifié, passer en en cours
      if ((payload.score1 > 0 || payload.score2 > 0) && payload.statut === 'Planifié') {
        payload.statut = 'En cours';
      }
      // supprimer les identifiants null/0 des objets liés
      if (payload.equipe1?.id !== undefined && payload.equipe1.id <= 0) delete (payload.equipe1 as any).id;
      if (payload.equipe2?.id !== undefined && payload.equipe2.id <= 0) delete (payload.equipe2 as any).id;
      if (payload.tournoi?.id !== undefined && payload.tournoi.id <= 0) delete (payload.tournoi as any).id;
      this.matchService.createMatch(payload).subscribe({
        next: created => {
          this.loadMatches();
          this.closeForm();
        },
        error: err => {
          console.error('Erreur création match:', err);
          alert('Impossible de créer le match, vérifiez la console pour plus de détails.');
        }
      });
    }
  }

  deleteMatch(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce match ?')) {
      this.matchService.deleteMatch(id).subscribe({
        next: () => {
          this.loadMatches();
        },
        error: err => {
          console.error('Erreur suppression match:', err);
          alert('Impossible de supprimer le match.');

        }
      });
    }
  }

  cancelForm(): void {
    this.closeForm();
  }
}