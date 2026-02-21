import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceThumbnail } from './face-thumbnail';

describe('FaceThumbnail', () => {
  let component: FaceThumbnail;
  let fixture: ComponentFixture<FaceThumbnail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceThumbnail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceThumbnail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
