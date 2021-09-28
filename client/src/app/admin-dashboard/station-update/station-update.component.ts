import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Station } from 'src/app/shared/station.model';
import { StationService } from 'src/app/shared/station.service';

declare var M: any;

@Component({
  selector: 'app-station-update',
  templateUrl: './station-update.component.html',
  styleUrls: ['./station-update.component.css'],
  providers: [StationService]
})
export class StationUpdateComponent implements OnInit {
  [x: string]: any;

  constructor(public stationService:StationService , private router: Router) { }

  ngOnInit(): void {
    this.resetForm();
    this.refreshStationList();
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.stationService.selectedStation = {
      _id: " ",
      stn!:'',
      stnCode!:''
    }
  }
  onSubmit(form: NgForm) {
    if (form.value._id == "") {
      this.stationService.postStation(form.value).subscribe((res: any) => {
        this.resetForm(form);
        this.refreshStationList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.stationService.putStation(form.value).subscribe((res: any) => {
        this.resetForm(form);
        this.refreshStationList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshStationList() {
    this.stationService.getStationList().subscribe((res:any) => {
      this.StationService.station = res as Station[];
    });
  }

  onEdit(station: Station) {
    if (confirm('Are you sure to Edit this record ?') == true) {
    
    this.stationService.selectedStation = station;
    M.toast({ html: 'Edited successfully', classes: 'rounded' });

  }
}

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.stationService.deleteStation(_id).subscribe((res:any) => {
        this.refreshStationList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}
