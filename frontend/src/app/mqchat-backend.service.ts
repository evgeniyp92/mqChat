import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root',
})
export class MqchatBackendService {
  constructor(
    private zone: NgZone,
    private sseService: SseService,
  ) {}

  test() {
    console.log('Message Queue Backend Service Working');
  }

  getServerSentEvent(url: string) {
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
}
