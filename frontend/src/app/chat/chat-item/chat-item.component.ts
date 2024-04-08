import { Component, Input, OnInit } from '@angular/core';

export interface ChatMessageObject {
  username: string;
  postDate: Date;
  message: string;
}

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css',
})
export class ChatItemComponent implements OnInit {
  @Input() messageObject: ChatMessageObject | null = null;

  ngOnInit(): void {
    console.log(this.messageObject);
  }
}
