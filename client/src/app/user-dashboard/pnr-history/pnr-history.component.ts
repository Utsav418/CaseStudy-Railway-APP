import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../http-web.service';
import { Router } from '@angular/router';
import { NgForm, Validators } from '@angular/forms';
declare var M: any;


@Component({
  selector: 'app-pnr-history',
  templateUrl: './pnr-history.component.html',
  styleUrls: ['./pnr-history.component.css'],
  providers: [HttpWebService]
})
export class PnrHistoryComponent implements OnInit {

  errors: any;
  userid: string = window.sessionStorage.getItem('userid')!;
  body!: string;
_id!: string;
  bookings: any[] = [];

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._httpWebService.myBookings()
    .subscribe((resp: any) => {
      const bookingData = resp;
      if (bookingData.length === 0 || bookingData == null) {
        document.getElementById('message')!.classList.remove('div-hidden');
        document.getElementById('message')!.classList.add('div-show');
      }
      this.bookings = bookingData;
    });
  }

  view_print(item: { basic: { pnrNumber: string; }; }) {
    window.localStorage.setItem('pnrNumber', item.basic.pnrNumber);
    window.open('http://localhost:4200/viewTicket', '_blank');
  }

  onDelete(_id: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this._httpWebService.cancelBooking(_id).subscribe((res:any) => {
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }
}

// function v(v: any, i: any) {
//   throw new Error('Function not implemented.');
// }

// function i(v: any, i: any) {
//   throw new Error('Function not implemented.');
// }

