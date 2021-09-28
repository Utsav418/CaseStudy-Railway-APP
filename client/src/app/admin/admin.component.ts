import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from '../http-web.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

 
  admin = '';

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    if (window.sessionStorage.getItem('auth-token') != null) {
      this._httpWebService.verifyUserLogin(window.sessionStorage.getItem('auth-token'))
      .subscribe((resp: any) => {
        const userData = resp;
        if (userData.status === '403') {
          this.router.navigate(['#']);
        } else {
          if (userData.route === '/admin') {
            this.router.navigate(['admin']);
            this._httpWebService.signInDetails()
              .subscribe( (respd: { status: string; firstName: string; }) => {
                if (respd.status === '200') {
                  this.admin = respd.firstName;

                }
              });

          } else {
            this.router.navigate(['user']);
          }
        }
      });
    } else {
      this.router.navigate(['']);
    }



  }

  logout() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['']);
  }

}
