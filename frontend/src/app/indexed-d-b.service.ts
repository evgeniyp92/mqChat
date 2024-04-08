import { Injectable } from '@angular/core';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import * as localforage from 'localforage';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  constructor() {}

  async getMessages(): Promise<ChatMessageObject[]> {
    const messages: ChatMessageObject[] | null =
      await localforage.getItem('messages');
    return messages || [];
  }

  async setMessages(newMessages: ChatMessageObject[]) {
    await localforage.setItem('messages', newMessages);
  }

  async getUserId(): Promise<{ username: string; uuid: string } | null> {
    return (await localforage.getItem('username'))
      ? localforage.getItem('username')
      : null;
  }

  async setUserId(username: string | null) {
    const user = {
      username: username || 'Anony Mouse',
      // TODO: crypto.randomUUID is not supported on mobile Safari, look at polyfills or crypto.subtle, or get HTTPS
      // Can do local https via ng serve --ssl
      // https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https
      uid: crypto.randomUUID(),
    };
    await localforage.setItem('username', user);
    return user;
  }
}
