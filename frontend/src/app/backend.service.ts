import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IndexedDBService } from './indexed-d-b.service';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { SSEService } from './sse.service';
import { v4 } from 'uuid';

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
    private sse: SSEService,
    private zone: NgZone,
  ) {}

  messages$ = new BehaviorSubject<ChatMessageObject[]>([]);
  username$ = new BehaviorSubject<string | null>(null);

  // Helper function that prepares everything for reading SSE from the Kafka backend
  getServerSentEvent() {
    return new Observable((observer) => {
      this.indexedDBService.getUserId().then((data) => {
        // TODO: Need to figure out what to do in the event there is no user
        // console.log(data);

        // Dangerous, fix this
        let subGroup = data?.uid || v4();

        const eventSource = this.sse.getEventSource(
          `http://${window.location.hostname}:4500/stream/${subGroup}`,
        );

        eventSource.onmessage = (event) => {
          this.zone.run(() => {
            observer.next(event);
          });
        };

        eventSource.onerror = (error) => {
          this.zone.run(() => {
            observer.error(error);
          });
        };
      });
    });
  }

  // Init function that reads messages from Indexed DB, gets/sets the username in state
  // and subscribes to the event stream under a unique uid
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
    this.getServerSentEvent().subscribe((v: any) => {
      const stateMessages = this.messages$.value;
      const newMessages: ChatMessageObject[] = [
        ...stateMessages,
        JSON.parse(v.data),
      ];
      this.messages$.next(newMessages);
      // TODO: Maybe shift to storing messages in state and write to IndexedDB in NgOnDestroy?
      // https://stackoverflow.com/questions/3888902/detect-browser-or-tab-closing
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event
      this.indexedDBService.setMessages(newMessages);
    });
    console.log('Done initializing');
  }

  // Function that handles posting new messages via HTTP
  async postNewMessage(newMessage: ChatMessageObject) {
    console.log(newMessage);
    try {
      this.http
        .post(`http://${window.location.hostname}:4500/stream`, newMessage)
        .subscribe((response) => {
          console.log(response);
        });
    } catch (err) {
      console.log(err);
    }
    // This chunk is redundant and handled by the SSE Observable
    // let messages = this.messages$.value;
    // messages = [...messages, newMessage];
    // await this.indexedDBService.setMessages(messages);
    // this.messages$.next(messages);
  }

  async setUsername(username: string | null) {
    let alreadyExists = false;
    let uid: string;
    let userToSet: {} = {};
    // there used to be a bug in here due to nesting subscribers -- unique usernames didnt get properly updated --
    // this was likely down to poor error handling in the apollo graphql backend. This nested subscription works
    // properly now, even though its ugly and should be refactored
    // TODO: Refactor this absolute nightmare of a function
    this.apollo
      .watchQuery<any>({
        query: GET_USER,
        variables: {
          username: username,
        },
      })
      .valueChanges.subscribe(({ data }) => {
        console.log('Get user sub');
        console.log(data);
        if (data && data.user?.username) {
          console.log('Username already found in database');
          alreadyExists = true;
          uid = data.user.uuid;
          this.indexedDBService
            .setUserId(data.user.username, true, uid)
            .then((result) => {
              this.username$.next(result.username);
            });
        } else {
          const uuidToSet = v4();
          this.apollo
            .mutate({
              mutation: CREATE_USER,
              variables: { username: username, uuid: uuidToSet },
            })
            .subscribe(({ data }) => {
              console.log('Create user sub');
              // @ts-expect-error
              console.log(data.createUser);
              // alreadyExists = false;
              this.indexedDBService
                // @ts-ignore
                .setUserId(data.createUser.username, false, uuidToSet)
                .then((result) => {
                  this.username$.next(result.username);
                });
            });
        }
      });
    // TODO: crypto.randomUUID is not supported on mobile Safari, look at polyfills or crypto.subtle, or get HTTPS
    // Can do local https via ng serve --ssl
    // https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https
    // const result = await this.indexedDBService.setUserId(
    //   username,
    //   alreadyExists,
    //   uid,
    // );
    // this.username$.next(result.username);
  }
}
