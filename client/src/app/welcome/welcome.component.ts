import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { 
    
  }

  ngOnInit(): void {
  }
  openInstagram(){
    window.open("https://www.instagram.com/");
  }
  openFacebook(){
    window.open("https://www.facebook.com/")
  }
  openLinkedin(){
    window.open(" https://www.linkedin.com/feed/")
  }

  openTwitter(){
    window.open("   https://twitter.com/?lang=en ")
  }
  openPinterest(){
    window.open("https://in.pinterest.com/")
  }
 
  

}
