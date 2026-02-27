import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private api = 'https://satvik-sanctuary-backend.onrender.com/api/bookings';

  constructor(private http: HttpClient) { }

  getSlots() {
    return this.http.get<any>(`${this.api}/slots`);
  }

  book(data: any) {
    return this.http.post<any>(`${this.api}/book`, data);
  }

  getMyBookings() {
    return this.http.get<any>(`${this.api}/mine`);
  }
}
