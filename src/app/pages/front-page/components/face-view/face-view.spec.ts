import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceView } from './face-view';

describe('FaceView', () => {
  let component: FaceView;
  let fixture: ComponentFixture<FaceView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
