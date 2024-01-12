import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './service.service';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { NotifierService } from 'angular-notifier';
//import { ApplicationService } from '../application/application.service';

//import { Application } from 'src/app/entity/application';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  private isOnboard = true;
  submitButtonName = 'Submit';
  originalService: Service[]=[];
  service = {} as Service;
  clientId:any;
  serviceId:any;

  serviceForm: FormGroup;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  applicationNames: string[] = ['CST', 'CST1']; 
  responseTypes: string[] = ['application/json', 'application/xml'];
  requestTypes: string[] = ['application/json', 'application/xml'];
  submitted = false;
  dropdownClicked = false;
  //applications: Application[] = [];
  //service:Service [] = [];
  responseType:string[] = [];
  requestType:string[] = [];
  constructor(private router: Router, private route: ActivatedRoute, 
    private serviceService:ServiceService,private formBuilder: FormBuilder,
    private messageService: MessageService,
    private notifier:NotifierService
    //private ApplicationService:ApplicationService
    ) {
     
      this.clientId=localStorage.getItem('id'); 
    
        this.serviceForm = this.formBuilder.group({
        id: ['0',Validators.required],
        clientId: [this.clientId, [Validators.required]],
        applicationName: ['', [Validators.required]],
        method:['',Validators.required],
        endpoint:['',Validators.required],
        name:['',Validators.required],
        keyword:['',Validators.required],
        summary:['',Validators.required],
        responseSchema:['',Validators.required],
        botResponseTemplate:['',Validators.required],
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
      

    }

    

    get f() { return this.serviceForm.controls; }
    
    view(i:number){
      this.isOnboard = false;
      this.submitButtonName='Edit';      
      this.service = this.originalService[i];  
      //this.f[this.id].setValue(18)  
      this.f['id'].setValue( this.service.id)
       
      //this.f['applicationId'].setValue( this.service.applicationId)
      this.f['keyword'].setValue(this.service.keyword);  
      this.f['name'].setValue( this.service.name)
      this.f['summary'].setValue( this.service.summary);
      this.f['endpoint'].setValue( this.service.endpoint)
      this.f['method'].setValue( this.service.method)
      this.f['responseTypes'].setValue(this.service.responseType); 
      this.f['requestTypes'].setValue(this.service.requestType); 
      this.f['responseSchema'].setValue(this.service.responseSchema);
      this.f['botResponseTemplate'].setValue(this.service.botResponseTemplate); 
      
     
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
          this.notifier.notify('error','Error')
        } else {
          this.originalService = r;
        }
    });
}

addParameter(serviceId:number){ 
  this.router.navigate(['main/parameter'],{ state: { id: serviceId } }) ;
}
 



  onSubmit() {    
    if (this.serviceForm.invalid) {  
      this.notifier.notify('error','invalid input')
      return;
    }
    this.submitted = true;
    const service: Service = {} as Service;  
    service.id = this.f['id'].value;   
    service.clientId  = this.clientId;
    //service.applicationId  = this.f['applicationId'].value;
    service.endpoint = this.f['endpoint'].value; 
    service.method = this.f['method'].value;   
    service.name = this.f['name'].value    
    service.keyword = this.f['keyword'].value;
    service.summary = this.f['summary'].value;   
    service.botResponseTemplate = this.f['botResponseTemplate'].value;
    service.status = "NEW";
    service.responseSchema = this.f['responseSchema'].value;
    service.responseType = this.responseType;
    service.requestType = this.requestType;   
    
    if(this.isOnboard){
      this.serviceService.onBoard(service).subscribe(
        (r) => {
          if (r.errorCode != undefined && r.errorCode != 200) {
            this.notifier.notify('error','Not able to onboard. Please try again later.');
          } else {
            this.notifier.notify('success','Successfully onboarded.');
          }
          this.submitted = false;
        },
        (error) => {           
          this.notifier.notify('error','An error occurred while communicating with the API.');
          this.submitted = false;
        }
      );
    }else{
      this.serviceService.editService(service).subscribe(
        (r) => {
          if (r.errorCode != undefined && r.errorCode != 200) {
            this.notifier.notify('error','Not able to edit. Please try again later.');
          } else {
            this.notifier.notify('success','Successfully edited.');
          }
          this.submitted = false;
        },
        (error) => { 
          this.notifier.notify('error','An error occurred while communicating with the API.');
          this.submitted = false;
        }
      ),()=>{
        
      };
      
    }
    
    
  }}