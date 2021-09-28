import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Trainclass } from './trainclass.models';

@Injectable(
  
)
export class TrainService {
  selectedTrain!: Trainclass 
  trains!:Trainclass[];
  
baseURL = 'http://localhost:3000/api/trains1';

  constructor(private http: HttpClient) { }
  
  postTrain(train: Trainclass) {
    return this.http.post(this.baseURL, train);
  }

  getTrainList() {
    return this.http.get(this.baseURL);
  }

  putTrain(train: Trainclass) {
    return this.http.put(this.baseURL + `/${train._id}`, train);
  }

  deleteTrain(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }

}
