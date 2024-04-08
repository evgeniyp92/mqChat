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
    this.onMessageSubmit.emit({ messageText: this.messageText });
  }

  handleKeypress(_: any) {
    // TODO: Decide what to do with keypresses
    console.log('handleKeyPress');
  }
}
