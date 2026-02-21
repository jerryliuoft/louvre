import { TestBed } from '@angular/core/testing';

import { FaceRecognition } from './face-recognition';

describe('FaceRecognition', () => {
  let service: FaceRecognition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceRecognition);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
