import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from 'src/app/http-web.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  profiles: any[] = [];

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._httpWebService.profileDetlCheck()
      .subscribe((resp: { status: string; }) => {
        if (resp.status = '200') {
          this.profiles.push(resp);
        } else {
          this.profiles = [];
        }
      });
  }
editAccount(){
  // this.router.navigate(['edit',this.profiles.id]);
}



}
