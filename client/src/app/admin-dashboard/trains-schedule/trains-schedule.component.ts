import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainService } from 'src/app/shared/train.service';

import { Trainclass } from 'src/app/shared/trainclass.models';
declare var M: any;

@Component({
  selector: 'app-trains-schedule',
  templateUrl: './trains-schedule.component.html',
  styleUrls: ['./trains-schedule.component.css'],
  providers: [TrainService]
})
export class TrainsScheduleComponent implements OnInit {

  constructor(public trainService:TrainService , private router: Router) { }

  ngOnInit(): void {
    this.resetForm();
    this.refreshTrainList();
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.trainService.selectedTrain = {
      _id: " ",
      trainNo:!"", 
      trainName: "", 
      runsFromStn!: "", 
      src!: "", 
      srcCode!: "", 
      dstn!: "", 
      dstnCode!: "", 
      fromStn!: "", 
      fromStnCode!: "", 
      toStn!: "", 
      toStnCode!: "", 
      depAtFromStn!: "", 
      arrAtToStn!: "", 
      travelTime!: "", 
      trainType!: "", 
      AC1Tier!: "", 
      AC2Tier!:"",
      sleeperClass!:""
    }
  }
  onSubmit(form: NgForm) {
    if (form.value._id == "") {
      this.trainService.postTrain(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshTrainList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.trainService.putTrain(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshTrainList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshTrainList() {
    this.trainService.getTrainList().subscribe((res:any) => {
      this.trainService.trains = res as Trainclass[];
    });
  }

  onEdit(train: Trainclass) {
    this.trainService.selectedTrain = train;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.trainService.deleteTrain(_id).subscribe((res:any) => {
        this.refreshTrainList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}

