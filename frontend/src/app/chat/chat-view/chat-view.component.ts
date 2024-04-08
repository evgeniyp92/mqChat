import { Component, Input } from '@angular/core';
import { ChatMessageObject } from '../chat-item/chat-item.component';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css',
})
export class ChatViewComponent {
  @Input() messages: ChatMessageObject[] | null = null;
}
