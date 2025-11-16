import { TestBed } from '@angular/core/testing';

import { ActualizacionUserService } from '../services/actualizacion-user.service'

describe('ActualizacionUserService', () => {
  let service: ActualizacionUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualizacionUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
