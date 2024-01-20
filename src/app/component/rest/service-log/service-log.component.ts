import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service';
import { ServiceLogService } from './service-log.service';
import { ServiceService } from '../service/service.service';
import { Service } from 'src/app/entity/service';
import { ServiceLog } from 'src/app/entity/serviceLog';

@Component({
  selector: 'app-service-log',
  templateUrl: './service-log.component.html',
  styleUrls: ['./service-log.component.css']
})
export class ServiceLogComponent implements OnInit {

  services:ServiceLog[] = [];

  constructor(private router: Router, private route: ActivatedRoute,  
    private messageService: MessageService,private serviceLogService:ServiceLogService) { 
      this.fetchLog();
    }

  

  ngOnInit(): void {
  }

  fetchLog() {
    this.serviceLogService.fetchService()
      .subscribe((r)=>{
        if (r.errorCode != undefined && r.errorCode != 200) {
          alert('Something went wrong.Please try in sometime.')
         } else {
          this.services = r.data;
         }          
      })
  }
}
