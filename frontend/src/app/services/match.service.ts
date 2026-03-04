import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService, User } from './auth.service';

export interface Match {
  id: number;
  equipe1: { id: number; nom: string; };
  equipe2: { id: number; nom: string; };
  tournoi: { id: number; nom: string; };
  score1: number;
  score2: number;
  dateMatch: string;
  statut: string;
  actions?: MatchAction[];
}

export interface MatchAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
  tooltip: string;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:8080/matchs';


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private readonly apiToUiStatus: { [key: string]: string } = {
    PENDING: 'Planifié',
    ONGOING: 'En cours',
    FINISHED: 'Terminé'
  };

  private readonly uiToApiStatus: { [key: string]: string } = {
    'Planifié': 'PENDING',
    'En cours': 'ONGOING',
    'Terminé': 'FINISHED'
  };

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl).pipe(
      map(matches => this.enrichMatchesWithActions(matches))
    );
  }

  private enrichMatchesWithActions(matches: Match[]): Match[] {
    return matches.map(match => ({
      ...match,
      statut: this.apiToUiStatus[match.statut] ?? match.statut,
      actions: this.getAvailableActions(match)
    }));
  }

  private getAvailableActions(match: Match): MatchAction[] {
    // Plus de boutons d'action, toute la gestion est faite via le panneau Admin
    return [];
  }

  // CRUD opérant sur le backend

  private mapToApi(match: Match): Match {
    return {
      ...match,
      statut: this.uiToApiStatus[match.statut] ?? match.statut
    };
  }

  createMatch(match: Match): Observable<Match> {
    const payload = this.mapToApi(match);
    // le serveur génère l'id, on évite d'envoyer 0
    if (payload.id !== undefined && payload.id <= 0) {
      // @ts-ignore
      delete payload.id;
    }
    return this.http.post<Match>(this.apiUrl, payload);
  }

  updateMatch(match: Match): Observable<Match> {
    const payload = this.mapToApi(match);
    return this.http.put<Match>(`${this.apiUrl}/${match.id}`, payload);
  }

  deleteMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}