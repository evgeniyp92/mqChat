import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../local-storage.service';
import { ChatMessageObject } from '../chat/chat-item/chat-item.component';
import { ChatViewComponent } from '../chat/chat-view/chat-view.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  message: string | '' = '';

  constructor(private localStorageService: LocalStorageService) {}

  handleClick() {
    console.log('click');
  }

  handleSubmit() {
    console.log(this.message);
    this.localStorageService
      .postMessage({
        message: this.message || 'Default message',
        username: 'Default Dan',
        postDate: new Date(),
      })
      .subscribe((response: ChatMessageObject[]) => {});
    this.message = '';
  }

  handleKeypress(event: KeyboardEvent) {
    console.log(event);
  }
}
