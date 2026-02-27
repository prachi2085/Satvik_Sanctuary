import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  //private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/user';
  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
