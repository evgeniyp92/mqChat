import { TestBed } from '@angular/core/testing';

import { IndexedDBService } from './indexed-d-b.service';

describe('LocalStorageService', () => {
  let service: IndexedDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
