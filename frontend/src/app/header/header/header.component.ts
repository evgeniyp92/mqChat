import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BackendService } from '../../backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(private backendService: BackendService) {}

  userName: FormControl<string | null> = new FormControl(null);
  // userName state subscriber replaces the logic in ngOnInit
  userName$ = this.backendService.username$.subscribe((v) => {
    if (v) {
      this.userName.setValue(v);
    }
  });

  ngOnInit() {}

  // TODO: Do the types even matter here, we just need to know to fire the function, it's handled in DOM
  async handleSubmit(event: FocusEvent | KeyboardEvent) {
    await this.backendService.setUsername(this.userName.getRawValue());
  }
}
