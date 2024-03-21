import { TestBed } from '@angular/core/testing';

import { MqchatBackendService } from './mqchat-backend.service';

describe('MqchatBackendService', () => {
  let service: MqchatBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqchatBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
