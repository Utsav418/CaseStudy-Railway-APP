import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpWebService } from 'src/app/http-web.service';

import { PnrStatusComponent } from './pnr-status.component';

describe('PnrStatusComponent', () => {
  let component: PnrStatusComponent;
  let fixture: ComponentFixture<PnrStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PnrStatusComponent ],
      providers: [ HttpWebService],
      imports:[
        HttpClientTestingModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PnrStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
