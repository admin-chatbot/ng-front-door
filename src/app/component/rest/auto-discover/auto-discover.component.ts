import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { MessageService } from 'src/app/http/message.service';
import { AutoDIscoverService } from './auto-discover.service';
import { Service } from 'src/app/entity/service';
import { SelectedService } from 'src/app/entity/selectedService';
import { AutoDiscoverServiceRequest } from 'src/app/entity/autoDiscoverServiceRequest';

@Component({
  selector: 'app-auto-discover',
  templateUrl: './auto-discover.component.html',
  styleUrls: ['./auto-discover.component.css']
})
export class AutoDiscoverComponent implements OnInit {

   url: string = "";
   services:Service[] = [];
   private selectedServices: SelectedService[] = [];
   applicationId!: number;
   clientId!:any;

   

  constructor(private router: Router, private route: ActivatedRoute,private messageService: MessageService, private dataService: DataService,private autoDiscover:AutoDIscoverService) { 
    var dataRecived : any = this.router.getCurrentNavigation()?.extras.state;
    this.applicationId = dataRecived.applicaionId;
    this.clientId = localStorage.getItem('id'); 
  }

  load(){
    var request = {} as AutoDiscoverServiceRequest;
    request.applicationId = this.applicationId;
    request.serviceId = this.clientId;
    request.url = this.url;
    request.autoDiscoverServiceRequestBodies = this.selectedServices;
    this.autoDiscover.loadService(request)
      .subscribe(res=>{
        if (res.errorCode != undefined && res.errorCode != 200) { 
          alert('Unable to load. Pleae try in sometime.')
        } else {
            alert('service loaded successfully.')
        }
      })

  }  

  discover() {
    this.autoDiscover.discoverService(this.url)
      .subscribe(res=>{
        if (res.errorCode != undefined && res.errorCode != 200) { 

        } else {
            this.services = res;
        }
      });
  }

  ngOnInit(): void {
    this.dataService.currentMessage.subscribe(m => { 
      this.url = m
    });      
    this.discover();
  }

  onChange(index: number, event: any) {  
    var service = this.services[index];
    var selectedService = {} as SelectedService;
    selectedService.endpoint = service.endpoint;
    selectedService.method = service.method;
    selectedService.name = service.name;

    if( event.target.checked) {     
      this.selectedServices.push(selectedService);
    } else {
        var index = this.services.findIndex((obj)=>{
          return (obj.endpoint === selectedService.endpoint 
            && obj.name === selectedService.name
            && obj.method === selectedService.method)
        })

        this.selectedServices = this.selectedServices.slice(index);
    }    
  } 


}
