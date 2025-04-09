import { Component,ElementRef,ViewChild,AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { marked } from 'marked';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  messages: { user: string; text: string; timestamp: Date }[] = [
    {
      user: 'AI',
      text: 'Hello! Describe your problems, symptoms or ask for first aid.',
      timestamp: new Date(),
    },
  ];
  userInput = '';
  isAITyping = false;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private chatService: ChatService, private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({
      user: 'You',
      text: this.userInput,
      timestamp: new Date(),
    });

    this.isAITyping = true;

    this.chatService.getMedicalResponse(this.userInput).subscribe({
      next: (response: any) => {
        this.messages.push({
          user: response.user,
          text: response.message,
          timestamp: new Date(),
        });
        this.isAITyping = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          user: 'AI',
          text: 'Service unavailable. Try later.',
          timestamp: new Date(),
        });
        this.isAITyping = false;
        this.scrollToBottom();
      },
    });

    this.userInput = '';
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getSanitizedHtml(markdown: string): string {
    return marked.parse(markdown) as string;
  }

}
