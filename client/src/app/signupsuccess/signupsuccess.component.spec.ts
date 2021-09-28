import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupsuccessComponent } from './signupsuccess.component';

describe('SignupsuccessComponent', () => {
  let component: SignupsuccessComponent;
  let fixture: ComponentFixture<SignupsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
