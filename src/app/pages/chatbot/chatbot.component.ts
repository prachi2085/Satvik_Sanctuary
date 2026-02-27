import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatMessage } from '../../models/chatbot.model';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {

  messages: ChatMessage[] = [];
  newMessage = '';

  constructor(private chatbotService: ChatbotService) { }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.chatbotService.sendMessage(this.newMessage, 1).subscribe({
      next: (msg: ChatMessage) => {
        this.messages.push(msg);
        this.newMessage = '';
      },
      error: (err: any) => console.error('Chat error:', err)
    });
  }
}
