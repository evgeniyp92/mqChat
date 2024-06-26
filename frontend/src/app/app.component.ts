import { Component, OnInit, isDevMode } from '@angular/core';
import { BackendService } from './backend.service';
import { ChatMessageObject } from './chat/chat-item/chat-item.component';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  messages$ = this.backend.messages$.subscribe((v) => {
    // console.log(v);
    this.messages = v;
  });
  messages: ChatMessageObject[] = [];

  constructor(
    private backend: BackendService,
    private metaService: Meta,
  ) {}

  ngOnInit() {
    this.backend.init().then(() => console.log('Done Initializing'));
    this.metaService.addTag({ name: 'theme-color', content: '#e4e4e7' });
    // read messages from localStorage and push to app state
    // expect a userid
    // open a connection to localhost:4500/[]
    // for each message received, push it to localStorage and update app state
    if (isDevMode()) {
      console.log('Dev Mode');
    } else {
      console.log('Production');
    }
  }

  handleOnMessageSubmit(event: { messageText: string }) {
    const submit: ChatMessageObject = {
      message: event.messageText,
      username: this.backend.username$.value!,
      postDate: Date.now(),
    };
    // try to post it to event stream
    this.backend.postNewMessage(submit).then();

    // update localStorage with the new message if successful

    // update app state with message -- redundant because of BehaviorSubject and will be handled in BackendService
  }

  handleClick() {}
}
