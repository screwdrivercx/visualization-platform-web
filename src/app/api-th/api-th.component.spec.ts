import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiThComponent } from './api-th.component';

describe('ApiThComponent', () => {
  let component: ApiThComponent;
  let fixture: ComponentFixture<ApiThComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiThComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
