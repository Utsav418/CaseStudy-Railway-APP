import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from 'src/app/http-web.service';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {

  
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
}
