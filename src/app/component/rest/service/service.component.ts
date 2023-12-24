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

  private isOnboard = true;
  originalService: Service[]=[];
  service = {} as Service;
  clientId:any;
  serviceForm: FormGroup;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  responseTypes: string[] = ['application/json', 'application/xml'];
  requestTypes: string[] = ['application/json', 'application/xml'];
  submitted = false;
  dropdownClicked = false;
  applications: Application[] = [];
  //service:Service [] = [];
  responseType:string[] = [];
  requestType:string[] = [];
  constructor(private router: Router, private route: ActivatedRoute, 
    private serviceService:ServiceService,private formBuilder: FormBuilder,
    private messageService: MessageService,
    private applicationService:ApplicationService) { 
      this.serviceForm = this.formBuilder.group({
        client: ['', [Validators.required]],
        applicationId: ['', [Validators.required]],
        method:['',Validators.required],
        endpoint:['',Validators.required],
        name:['',Validators.required],
        keyword:['',Validators.required],
        summary:['',Validators.required],
        response:['',Validators.required],
        responseTemplate:['',Validators.required],
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
    
    view(i:number){
      this.isOnboard = false;
    
      
      this.service = this.originalService[i];
      this.f['applicationId'].setValue( this.service.applicationId)
      this.f['keyword'].setValue(this.service.keyword);  
      this.f['name'].setValue( this.service.name)
      this.f['endpoint'].setValue( this.service.endpoint)
      this.f['method'].setValue( this.service.method)
      this.f['responseTypes'].setValue(this.service.responseType); 
      this.f['requestTypes'].setValue(this.service.requestType); 
      this.f['response'].setValue(this.service.response);
      this.f['responseTemplate'].setValue(this.service.responseTemplate); 
     
  }

  

  ngOnInit(): void {
  }
  onDropdownClick() {
    this.dropdownClicked = true;
  }




getServices(){
  this.serviceService.fetchService()
    .subscribe(r=>{ 
       
        if (r.errorCode != undefined && r.errorCode != 200) {
         console.log('error')
        } else {
          this.originalService = r;
        }
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
    alert(this.isOnboard);
    if(this.isOnboard){
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
    }else{
      alert('edit')
    }
    
    
  }}