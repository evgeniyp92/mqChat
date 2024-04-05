import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public messages$ = new BehaviorSubject<ChatMessageObject[] | null>(null);

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

  checkMessagesObservable() {
    const value = new BehaviorSubject<ChatMessageObject[] | null>([]);
    const observable = value.asObservable();

    const observer = async () => {
      const messages = await this.checkMessages();
      value.next(messages);
    };

    observer();
    return observable;
  }

  async populateMessagesIfNotExists(messagesToSet: ChatMessageObject[]) {
    const messages = await localforage.getItem('messages');
    if (!messages) {
      await localforage.setItem('messages', messagesToSet);
    }
  }

  postMessage(message: ChatMessageObject) {
    const value = new BehaviorSubject<ChatMessageObject[]>([]);
    const observable = value.asObservable();

    const observer = async () => {
      let messages: ChatMessageObject[] | null =
        await localforage.getItem('messages');
      if (messages) {
        messages = [...messages, message];
        await localforage.setItem('messages', messages);
        value.next(messages);
      } else {
        messages = [message];
        await localforage.setItem('messages', messages);
        value.next(messages);
      }
    };

    observer();
    return observable;
  }
}
