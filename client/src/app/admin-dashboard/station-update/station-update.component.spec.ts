import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationUpdateComponent } from './station-update.component';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import{HttpClientModule} from '@angular/common/http'
import { HttpWebService } from 'src/app/http-web.service';
import { StationService } from 'src/app/shared/station.service';

describe('StationUpdateComponent', () => {
  let component: StationUpdateComponent;
  let fixture: ComponentFixture<StationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        HttpClientModule
      ],
      declarations: [ StationUpdateComponent ],
      providers: [StationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
