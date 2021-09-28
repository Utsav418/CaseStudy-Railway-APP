import { TestBed } from '@angular/core/testing';

import { TrainService } from './train.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import{HttpClientModule} from '@angular/common/http'
describe('TrainService', () => {
  let service: TrainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
         HttpClientModule]
    });
    service = TestBed.inject(TrainService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
