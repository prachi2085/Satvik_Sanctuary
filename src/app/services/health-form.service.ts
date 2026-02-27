import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HealthForm } from '../models/health-form.model';

@Injectable({ providedIn: 'root' })
export class HealthFormService {
  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/healthform';

  constructor(private http: HttpClient) { }

  //submit(form: HealthForm): Observable<HealthForm> {
  //  return this.http.post<HealthForm>(this.apiUrl, form);
  //}

  submit(data: any) {
    return this.http.post(`${this.apiUrl}/submit`, data);
  }
}
