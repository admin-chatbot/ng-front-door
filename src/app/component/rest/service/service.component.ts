import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './service.service';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { ApplicationService } from '../application/application.service';
import { Application } from 'src/app/entity/application';



@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  originalService: Service[]=[]
  clientId:any;
  serviceForm: FormGroup;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  responseTypes: string[] = ['application/json', 'application/xml'];
  submitted = false;
  dropdownClicked = false;
  applications:Application [] = [];
  responseType:string[] = [];
  requestType:string[] = [];
  constructor(private router: Router, private route: ActivatedRoute, 
    private serviceService:ServiceService,private formBuilder: FormBuilder,
    private messageService: MessageService,
    private applicationService:ApplicationService) { 
      this.serviceForm = this.formBuilder.group({
        client: ['client12', [Validators.required]],
        applicationId: ['1', [Validators.required]], 
        method:['',Validators.required],
        endpoint:['http:/client/v1',Validators.required],
        name:['name',Validators.required],
        keyword:['keyword',Validators.required],
        summary:['summary',Validators.required],
        response:['response',Validators.required],
        responseTemplate:['responseTemplate',Validators.required],
        requestTypes: [[]],
        responseTypes: [[]],
      });
      

      this.getServices();        

      this.f['responseTypes'].valueChanges.subscribe(v=>{
        this.responseType = v;
      });

      this.f['requestTypes'].valueChanges.subscribe(v=>{
        this.requestType = v;
      });
      this.clientId=localStorage.getItem('id');

    }

    

    get f() { return this.serviceForm.controls; }

  ngOnInit(): void {
  }
  onDropdownClick() {
    this.dropdownClicked = true;
  }


fetchApplication() {
  this.applicationService.fetchApplication()
    .subscribe(res=>{
      if (res.errorCode != undefined && res.errorCode != 200) {                  
      } else {
        this.applications = res;
      }
    });
}

getServices(){
  this.serviceService.fetchService()
    .subscribe(r=>{ 
        this.originalService = r;
    });
}
 

  onSubmit() {    
    if (this.serviceForm.invalid) { 
      alert('invalid input')
      return;
    }
    this.submitted = true;
    const service: Service = {} as Service;


    

    service.id = 0
    service.clientId = this.f['client'].value;
    service.applicationId  = this.f['applicationId'].value;
    service.endpoint = this.f['endpoint'].value; 
    service.method = this.f['method'].value;   
    service.name = this.f['name'].value    
    service.keyword = this.f['keyword'].value;
    service.summary = this.f['summary'].value;   
    service.responseTemplate = this.f['responseTemplate'].value;
    service.status = "NEW";
    service.response = this.f['response'].value;
    service.responseType = this.responseType;
    service.requestType = this.requestType;   
    

    
    this.serviceService.onBoard(service).subscribe(
      (r) => {
        if (r.errorCode != undefined && r.errorCode != 200) {
          alert('Not able to onboard. Please try again later.');
        } else {
          alert('Successfully onboarded.');
        }
        this.submitted = false;
      },
      (error) => {
        console.error('API Error:', error);
        alert('An error occurred while communicating with the API.');
        this.submitted = false;
      }
    );
  }}