import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  test() {
    console.log('boop');
  }

  async checkMessages() {
    try {
      const messages: ChatMessageObject[] | null =
        await localforage.getItem('messages');
      if (messages) {
        return messages;
      } else {
        console.log('Nothing found but error not thrown');
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async populateMessagesIfNotExists(messagesToSet: ChatMessageObject[]) {
    const messages = await localforage.getItem('messages');
    if (!messages) {
      await localforage.setItem('messages', messagesToSet);
    }
  }

  // TODO: Make this an observable
  async postMessage(message: ChatMessageObject) {
    const messages: ChatMessageObject[] | null =
      await localforage.getItem('messages');
    if (messages) {
      messages.push(message);
      await localforage.setItem('messages', messages);
    } else {
      await localforage.setItem('messages', [message]);
    }
  }
}
