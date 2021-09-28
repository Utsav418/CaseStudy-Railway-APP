import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplIndiaComponent } from './expl-india.component';

describe('ExplIndiaComponent', () => {
  let component: ExplIndiaComponent;
  let fixture: ComponentFixture<ExplIndiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplIndiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
