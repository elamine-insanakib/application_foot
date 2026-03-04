import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  roles: UserRole[] = [];
  selectedRole: UserRole = 'guest';

  get currentUser$() {
    return this.authService.currentUser$;
  }

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.roles = this.authService.getRoles();
  }

  login(role: UserRole): void {
    this.authService.login(role);
    this.selectedRole = role;
  }

  getRoleLabel(role: UserRole): string {
    const labels: { [key in UserRole]: string } = {
      admin: 'Administrateur',
      user: 'Utilisateur',
      guest: 'Invité'
    };
    return labels[role];
  }
}
