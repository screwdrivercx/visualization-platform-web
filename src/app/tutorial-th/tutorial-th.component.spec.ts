import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialThComponent } from './tutorial-th.component';

describe('TutorialThComponent', () => {
  let component: TutorialThComponent;
  let fixture: ComponentFixture<TutorialThComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialThComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
