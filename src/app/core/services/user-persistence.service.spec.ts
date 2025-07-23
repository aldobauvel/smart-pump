import { TestBed } from '@angular/core/testing';

import { UserPersistenceService } from './user-persistence.service';

describe('UserPersistenceService', () => {
  let service: UserPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
