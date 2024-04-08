import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDBService } from './indexed-d-b.service';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(
    private indexedDBService: IndexedDBService,
    private http: HttpClient,
  ) {}

  messages$ = new BehaviorSubject<ChatMessageObject[]>([]);
  username$ = new BehaviorSubject<string | null>(null);

  async init() {
    const messages = await this.indexedDBService.getMessages();
    this.messages$.next(messages);
    const data = await this.indexedDBService.getUserId();
    if (data) {
      const { username } = data;
      // console.log(username);
      if (username) {
        this.username$.next(username);
      }
    } else {
      this.username$.next('Anony Mouse');
    }
  }

  async postNewMessage(newMessage: ChatMessageObject) {
    let messages = this.messages$.value;
    messages = [...messages, newMessage];
    await this.indexedDBService.setMessages(messages);
    this.messages$.next(messages);
  }

  async setUsername(username: string | null) {
    const result = await this.indexedDBService.setUserId(username);
    this.username$.next(result.username);
  }
}
