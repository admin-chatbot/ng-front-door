import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { MessageService } from 'src/app/http/message.service';
import { AutoDIscoverService } from './auto-discover.service';
import { Service } from 'src/app/entity/service';
import { SelectedService } from 'src/app/entity/selectedService';
import { AutoDiscoverServiceRequest } from 'src/app/entity/autoDiscoverServiceRequest';
import { AutoDiscoverService } from 'src/app/entity/autoDiscoverList';
import { NotifierService } from 'angular-notifier';

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
   checkBoxList:AutoDiscoverService[]= [];
   selectAll:boolean = false;

   

  constructor(private router: Router, private route: ActivatedRoute,private messageService: MessageService, private dataService: DataService,private autoDiscover:AutoDIscoverService,private notification:NotifierService) { 
    var dataRecived : any = this.router.getCurrentNavigation()?.extras.state;
    this.applicationId = dataRecived.applicaionId;
    this.url = dataRecived.docUrl
    this.clientId = localStorage.getItem('id');  
    this.discover();
  }

  toggle() {
    this.checkBoxList.forEach((e)=>e.checked=!this.selectAll);
    this.selectAll = !this.selectAll;
  }

  load(){
    var request = {} as AutoDiscoverServiceRequest;
    request.applicationId = this.applicationId;
    request.serviceId = this.clientId;
    request.url = this.url;
    this.selectedServices = [];
    this.checkBoxList.forEach((ele)=>{      
      if(ele.checked) {
         this.selectedServices.push({'endpoint':ele.service.endpoint,'method':ele.service.method,'name':ele.service.name})
      }
    }); 
    if(this.selectedServices.length==0){
      this.notification.notify('error','No service is selected.');
      return;
    }


    request.autoDiscoverServiceRequestBodies = this.selectedServices; 
    this.autoDiscover.loadService(request)
      .subscribe(res=>{
        if (res.errorCode != undefined && res.errorCode != 200) { 
          this.notification.notify('error','Unable to load. Pleae try in sometime.')
        } else {
          this.notification.notify('success','service loaded successfully.')
            this.checkBoxList.forEach((ele)=>{
              ele.checked = false;
            });
        }
      })

  }  

  discover() {
    this.autoDiscover.discoverService(this.applicationId)
      .subscribe(res=>{
        if (res.errorCode != undefined && res.errorCode != 200) { 

        } else {
            this.services = res;
            this.services.forEach(element => {
              this.checkBoxList.push({'id':element.id,'service':element,'checked':false});
            });
        }
      });
  }


  ngOnInit(): void {
   
  }

  onChange(service: Service) {  
    var index = this.services.findIndex((obj)=>{
      return (obj.endpoint === service.endpoint 
        && obj.name === service.name
        && obj.method === service.method)
    })  
    this.checkBoxList[index].checked = !this.checkBoxList[index].checked;     
  } 


}
