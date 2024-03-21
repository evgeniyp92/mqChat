import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface ChatMessageObject {
  username: string;
  postDate: Date;
  message: string;
}

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css',
})
export class ChatItemComponent {
  @Input() messageObject: ChatMessageObject | null = null;
}
