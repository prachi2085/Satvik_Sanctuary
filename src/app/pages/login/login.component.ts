import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        console.log("FULL RESPONSE:", res);

        const token = res?.data?.token;

        if (!token) {
          alert('Login failed: No token received');
          return;
        }

        // ✅ Use this instead of saveToken()
        this.authService.handleLoginSuccess(token);

        this.router.navigate(['/']);
      },
      error: (err: any) => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
  }
}
