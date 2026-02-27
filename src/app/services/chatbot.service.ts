import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chatbot.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'https://localhost:7071/api/chat';

  constructor(private http: HttpClient) { }

  sendMessage(message: string, userId: number): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.apiUrl, { message, userId });
  }
}
