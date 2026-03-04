import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // Utilisateurs de simulation
  private mockUsers: { [key in UserRole]: User } = {
    admin: { id: 1, name: 'Admin User', role: 'admin' },
    user: { id: 2, name: 'Regular User', role: 'user' },
    guest: { id: 3, name: 'Guest User', role: 'guest' }
  };

  constructor() {
    // Initialize avec guest par défaut
    this.currentUserSubject.next(this.mockUsers['guest']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(role: UserRole): void {
    const user = this.mockUsers[role];
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  getRoles(): UserRole[] {
    return ['admin', 'user', 'guest'];
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const currentRole = this.getCurrentUser()?.role;
    if (!currentRole) return false;
    if (Array.isArray(role)) {
      return role.includes(currentRole);
    }
    return currentRole === role;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getCurrentUser()?.role !== 'guest';
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}
