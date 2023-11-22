import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNavComponent } from './view-nav.component';

describe('ViewNavComponent', () => {
  let component: ViewNavComponent;
  let fixture: ComponentFixture<ViewNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewNavComponent]
    });
    fixture = TestBed.createComponent(ViewNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
