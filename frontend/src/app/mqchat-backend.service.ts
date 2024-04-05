import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { HttpClient } from '@angular/common/http';

// TODO: Research what ngzone is and why i need it here.
// TODO: See what happens when I just wrap the event stream in an observable

@Injectable({
  providedIn: 'root',
})
export class MqchatBackendService {
  constructor(
    private zone: NgZone,
    private sseService: SseService,
    private httpClient: HttpClient,
  ) {}

  test() {
    console.log('Message Queue Backend Service Working');
  }

  getMessageStream(url: string) {
    const observable = new Observable((observer) => {
      const eventSource = this.sseService.getEventSource(url);

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
  }

  postToMessageStream(_url: string, message: any) {
    // use httpclient to make a post request to localhost:4500/stream/
    // body should have the contents of the message param
  }

  checkUserExists() {}

  createNewUser() {}
}
