import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-expl-india',
  templateUrl: './expl-india.component.html',
  styleUrls: ['./expl-india.component.css']
})
// export class ExplIndiaComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//     window.scrollTo(0, 0);
//   }

// }

export class ExplIndiaComponent  {
  name = 'Set iframe source';
  url: string = "https://www.realmadrid.com/en";
  urlSafe!: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}

