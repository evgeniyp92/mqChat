import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDBService } from './indexed-d-b.service';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';

const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      id
      username
      uuid
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $uuid: String!) {
    createUser(username: $username, uuid: $uuid) {
      id
      username
      uuid
    }
  }
`;

// TODO: Implement this interface to simplify username state handling
interface UsernameProps {
  username: string;
  inUse: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(
    private indexedDBService: IndexedDBService,
    private http: HttpClient,
    private apollo: Apollo,
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
    let alreadyExists = false;
    let uid = crypto.randomUUID();
    // bug in here due to nesting subscribers -- unique usernames dont get properly updated
    // TODO: Refactor this using RxJS -- Will switchmap do the trick?
    this.apollo
      .watchQuery<any>({
        query: GET_USER,
        variables: {
          username: username,
        },
      })
      .valueChanges.subscribe(({ data }) => {
        if (data && data.user?.username) {
          console.log('Username already found in database');
          alreadyExists = true;
        } else {
          this.apollo
            .mutate({
              mutation: CREATE_USER,
              variables: { username: username, uuid: uid },
            })
            .subscribe(({ data }) => {
              alreadyExists = false;
            });
        }
      });
    // TODO: crypto.randomUUID is not supported on mobile Safari, look at polyfills or crypto.subtle, or get HTTPS
    // Can do local https via ng serve --ssl
    // https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https
    const result = await this.indexedDBService.setUserId(
      username,
      alreadyExists,
      uid,
    );
    this.username$.next(result.username);
  }
}
