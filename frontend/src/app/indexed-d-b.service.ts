import { Injectable } from '@angular/core';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import * as localforage from 'localforage';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  constructor() {}

  // Function to read messages from Indexed DB
  async getMessages(): Promise<ChatMessageObject[]> {
    const messages: ChatMessageObject[] | null =
      await localforage.getItem('messages');
    return messages || [];
  }

  // Message setting handler
  async setMessages(newMessages: ChatMessageObject[]) {
    await localforage.setItem('messages', newMessages);
  }

  // Tries to retrieve the current user, if one is stored in Indexed DB
  getUserId(): Promise<{ username: string; uid: string } | null> {
    return localforage.getItem('username');
  }

  // Sets a user in Indexed DB
  async setUserId(
    username: string | null,
    alreadyExisted: boolean,
    uid: string,
  ) {
    const user = {
      username: username || 'Anony Mouse',
      uid,
      alreadyExisted,
    };
    await localforage.setItem('username', user);
    return user;
  }
}
