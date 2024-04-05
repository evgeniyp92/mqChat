import { Component, OnInit } from '@angular/core';
import {
  ChatItemComponent,
  ChatMessageObject,
} from '../chat-item/chat-item.component';
import { NgForOf } from '@angular/common';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [ChatItemComponent, NgForOf],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css',
})
export class ChatViewComponent implements OnInit {
  chatItems: ChatMessageObject[] = [];

  constructor(private localStorage: LocalStorageService) {}

  async ngOnInit() {
    await this.localStorage.populateMessagesIfNotExists(this.chatItems);
    const messages = this.localStorage
      .checkMessagesObservable()
      .subscribe((r) => {
        if (r) this.chatItems = r;
      });
  }

  handleClick() {
    console.log('click');
  }

  handleUpdate() {}
}
