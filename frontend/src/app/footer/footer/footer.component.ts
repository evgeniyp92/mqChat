import { Component, EventEmitter, Output } from '@angular/core';
import { ChatMessageObject } from '../../chat/chat-item/chat-item.component';
import { BackendService } from '../../backend.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  messageText: string = '';
  @Output() onMessageSubmit = new EventEmitter();

  handleSubmit() {
    if (this.messageText.length > 0) {
      this.onMessageSubmit.emit({ messageText: this.messageText });
      // TODO: This sucks because it is 100% optimistic that the message will be sent, it should wait for some kind of
      //  acknowledgement the message has been posted then clear the field
    }
    this.messageText = '';
  }

  handleKeypress(event: KeyboardEvent) {
    // TODO: Decide what to do with keypresses
    console.log('handleKeyPress');
    console.log(event);
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      this.handleSubmit();
    }
  }
}
