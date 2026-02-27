import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
//import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  username = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onRegister() {
    const data = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: (res: any) => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        alert('Registration failed');
        console.error(err);
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
