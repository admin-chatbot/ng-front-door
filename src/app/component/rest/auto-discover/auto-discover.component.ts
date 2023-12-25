import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/common/data.service';

@Component({
  selector: 'app-auto-discover',
  templateUrl: './auto-discover.component.html',
  styleUrls: ['./auto-discover.component.css']
})
export class AutoDiscoverComponent implements OnInit {

   url: string = "";

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.currentMessage.subscribe(m => this.url = m);

    alert(this.url)
  }

}
