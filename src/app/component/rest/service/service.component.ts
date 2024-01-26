import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './service.service';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { Application } from 'src/app/entity/application';
import { ServiceSearch } from 'src/app/entity/serviceSearch';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
//import { ApplicationService } from '../application/application.service';
//import { Application } from 'src/app/entity/application';
import { CommonService } from 'src/app/services/common.service';

export interface ServiceSearchData { 
  name: string;
  endPoint: string;
  method: string; 
  status: string;
}

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
  //applicationNames: string[] = []; 
  responseTypes: string[] = ['application/json', 'application/xml'];
  requestTypes: string[] = ['application/json', 'application/xml'];
  submitted = false;
  dropdownClicked = false;
  applications: Application[] = [];
  //service:Service [] = [];
  responseType:string[] = [];
  requestType:string[] = [];
  
   servSearch:ServiceSearch = {} as ServiceSearch;
   searchMap = new Map();
   isSearch:boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private serviceService:ServiceService,private formBuilder: FormBuilder,
    private messageService: MessageService,
    private notifier:NotifierService,private dialog: MatDialog,public commonService:CommonService
    //private ApplicationService:ApplicationService
    ) {
     
 
      this.clientId=localStorage.getItem('id'); 
      
      this.getServiceByClientIdAndStatus(this.clientId,"ACTIVE");
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

          

     

      this.f['responseTypes'].valueChanges.subscribe(v=>{
        this.responseType = v;
      });

      this.f['requestTypes'].valueChanges.subscribe(v=>{
        this.requestType = v;
      });
      

    }

    remove(field:string){ 
      if(this.searchMap.has(field)) {
        this.searchMap.delete(field);
      }
      this.servSearch = Object.fromEntries(this.searchMap);   
      //this.servSearch.clientId = this.clientId;
    
      
      if(this.searchMap.size == 0) {
        this.getServiceByClientIdAndStatus(this.clientId,"ACTIVE");
        this.isSearch = false;
      } else {
        this.serviceService.search(this.servSearch)
            .subscribe(res=>{
              if (res.errorCode != undefined && res.errorCode != 200) { 
                this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
              } else {
                this.originalService = res.data; 
              }           
            }); 
      }
     }
    
    openDialog(): void {
      const dialogRef = this.dialog.open(ServiceSearchDialog, {
        width: '350px',
        data: this.servSearch
      });
  
      dialogRef.afterClosed().subscribe(r => {
        console.log('The dialog was closed');
        if(r!=undefined){
          this.servSearch = r;
          this.serviceService.search(this.servSearch)
          .subscribe(res=>{
            if (res.errorCode != undefined && res.errorCode != 200) { 
              this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
            } else {
              this.originalService = res.data; 
            }           
          });
        this.searchMap = new Map(Object.entries(r));
        this.isSearch = true; 
      }
    });
  }

    get f() { return this.serviceForm.controls; }
    
    view(i:number){
      this.isOnboard = false;
      this.submitButtonName='Edit';      
      this.service = this.originalService[i];  
      //this.f[this.id].setValue(18)  
      this.f['id'].setValue( this.service.id)
      
      alert(this.service.applicationId) 
      this.f['applicationName'].setValue( this.service.applicationId)
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
    this.fetchApplicationNames();
  }


  getServiceByClientIdAndStatus(id:number,status:string){
    this.serviceService.fetchServiceByClientAndStatus(id,status)
      .subscribe(r=>{ 
          this.originalService = r.data;
      });
  }
  fetchApplicationNames() {
    this.serviceService.fetchApplicationNames(this.clientId)
      .subscribe(
        (response) => {
          this.applications = response.data;
        },
        (error) => {
          console.error('Error fetching application names:', error);
        }
      );
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
          this.originalService = r.data;
        }
    });
}

addParameter(serviceId:number){ 
  this.router.navigate(['main/parameter'],{ state: { id: serviceId } }) ;
}
 

 

  onSubmit() {    
    if (this.serviceForm.invalid) {   
      this.notifier.notify( "error", "All field are required." );
      return;
    }
    this.submitted = true;
    const service: Service = {} as Service;  
    service.id = this.f['id'].value;   
    service.clientId  = this.clientId;
    service.applicationId  = this.f['applicationName'].value;
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
            this.getServiceByClientIdAndStatus(this.clientId,"ACTIVE");
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



  
  

  @Component({
    selector: 'dialog-overview-example-dialog',
    template:`<h2 mat-dialog-title>Search</h2>
    <div  style="width: 100%;">
       
      <mat-form-field style="width: 300px;">
        <input matInput [(ngModel)]="data.name" placeholder="Name"/>      
      </mat-form-field>
  
      <mat-form-field style="width: 300px;">
        <input matInput   [(ngModel)]="data.method" placeholder="Method"/>      
      </mat-form-field>
  
      <mat-form-field style="width: 300px;">
        <input matInput [(ngModel)]="data.endPoint" placeholder="EndPoint"/>      
      </mat-form-field> 
      
      <mat-form-field style="width: 300px;">
        <input matInput [(ngModel)]="data.status" placeholder="Status"/>      
      </mat-form-field>  
      
  
    </div>
    <div mat-dialog-actions> 
      <button class="btn btn-primary" mat-button [mat-dialog-close]="data" cdkFocusInitial>Search</button>
    </div>`
  })
  export class ServiceSearchDialog {

    constructor(
      public dialogRef: MatDialogRef<ServiceSearchDialog>,
      @Inject(MAT_DIALOG_DATA) public data: ServiceSearchData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    
  }