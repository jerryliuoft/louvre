import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryChipsComponent } from './directory-chips.component';

describe('DirectoryChipsComponent', () => {
  let component: DirectoryChipsComponent;
  let fixture: ComponentFixture<DirectoryChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryChipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectoryChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
