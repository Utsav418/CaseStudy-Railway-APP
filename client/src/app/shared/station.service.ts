import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Station } from './station.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable({
  providedIn: 'root'
})
export class StationService {

  selectedStation!: Station 
  stations!:Station[];
  
  
baseURL = 'http://localhost:3000/api/stations1';

  constructor(private http: HttpClient) { }
  
  postStation(station: Station) {
    return this.http.post(this.baseURL, station);
  }

  getStationList() {
    return this.http.get(this.baseURL);
  }

  putStation(Station: Station) {
    return this.http.put(this.baseURL + `/${Station._id}`, Station);
  }

  deleteStation(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}
