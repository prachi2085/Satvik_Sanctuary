import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chatbot.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/chat';

  constructor(private http: HttpClient) { }

  sendMessage(message: string, userId: number): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.apiUrl, { message, userId });
  }
}
