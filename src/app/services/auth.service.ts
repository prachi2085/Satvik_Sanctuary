import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7071/api/auth';
  private logoutTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  // ==============================
  // REGISTER
  // ==============================
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ==============================
  // LOGIN
  // ==============================
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  handleLoginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.checkTokenExpiration();
  }

  // ==============================
  // TOKEN
  // ==============================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ==============================
  // LOGIN CHECK (SMART VERSION)
  // ==============================
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      if (!decoded.exp) return false;

      const expiryTime = decoded.exp * 1000;
      return expiryTime > Date.now();
    } catch {
      return false;
    }
  }

  // ==============================
  // LOGOUT
  // ==============================
  logout() {
    localStorage.removeItem('token');

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.router.navigate(['/login']);
  }

  // ==============================
  // AUTO EXPIRY CHECK
  // ==============================
  checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);

      if (!decoded.exp) return;

      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();

      const timeout = expiryTime - currentTime;

      if (timeout <= 0) {
        this.logout();
      } else {
        this.logoutTimer = setTimeout(() => {
          this.logout();
        }, timeout);
      }
    } catch {
      this.logout();
    }
  }
}
