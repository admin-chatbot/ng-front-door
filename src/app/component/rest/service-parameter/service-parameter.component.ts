import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ServiceParameter } from '../service-parameter/service-parameter.service';
import { ServiceParameterService } from '../service-parameter/service-parameter.service'
import { ServiceParameter } from 'src/app/entity/serviceParameters';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service'; 
import { Type } from '@angular/compiler';
import { SelectedService } from 'src/app/entity/selectedService';
import { Service } from 'src/app/entity/service';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServiceParameterSearch } from 'src/app/entity/serviceParameterSearch';

export interface ServiceParameterSearchData { 
  name: string;
  description: string;
  required: string; 
}

@Component({
  selector: 'app-service-parameter',
  templateUrl: './service-parameter.component.html',
  styleUrls: ['./service-parameter.component.css']
})
export class ServiceParameterComponent implements OnInit {

  private isOnboard = true;
  submitButtonName = 'Submit';
  originalServiceParameter: ServiceParameter[]=[];
  serviceParameter = {} as ServiceParameter;
  serviceId:any;

  
  serviceParameterForm: FormGroup  ;
  required: boolean[] = [true, false]; // Add more methods as needed
  type: string[] = ['header','body'];
  paramType: string[] = ['string','int'];
  questionToGetInput: string[] = [];
  submitted = false;
  dropdownClicked = false;

  servParameterSearch:ServiceParameterSearch = {} as ServiceParameterSearch;
   searchMap = new Map();
   isSearch:boolean = false;
 
  //service:Service [] = [];
  //responseType:string[] = [];
  //requestType:string[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private serviceParameterService: ServiceParameterService,  // Make sure this is included
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serciceParameterService: ServiceParameterService,
    private notifire:NotifierService,private dialog: MatDialog) {
    var dataRecived : any = this.router.getCurrentNavigation()?.extras.state;
      this.serviceId=dataRecived.id; 
     
      this.serviceParameterForm = this.formBuilder.group({
        id: ['0'],
        serviceId: [this.serviceId, Validators.required],
        description: ['', [Validators.required]],
        required: ['', Validators.required],
        type: ['', Validators.required],
        paramType: ['', Validators.required],
        jsonFormat: ['', Validators.required],
        name: ['', Validators.required],
        questionToGetInput: [[]],
        in: ['']
       
    });
 
      this.getServiceParmeter(this.serviceId);

    }
   
    
    ngOnInit(): void {
      var dataRecived: any = this.router.getCurrentNavigation()?.extras.state;
      this.serviceId = dataRecived.id;
      this.getServiceParmeter(this.serviceId);
    }


    openDialog(): void {
      const dialogRef = this.dialog.open(ServiceParameterSearchDialog, {
        width: '350px',
        data: this.servParameterSearch
      });
  
      dialogRef.afterClosed().subscribe(r => {
        console.log('The dialog was closed');
        if(r!=undefined){
          alert(JSON.stringify(r));
          this.servParameterSearch = r;
          this.searchMap = new Map(Object.entries(r));
          this.isSearch = true;
        }
      });
    }
    get f() { return this.serviceParameterForm.controls; }
    
    view(i: number) {
      this.isOnboard = false;
      this.submitButtonName = 'Edit';   
      const selectedService = this.originalServiceParameter[i];   
      this.f['id'].setValue(selectedService.id);
      this.f['serviceId'].setValue(selectedService.serviceId);
      this.f['description'].setValue(selectedService.description);
      this.f['required'].setValue(selectedService.required);
      this.f['type'].setValue(selectedService.type);   
      
      this.f['paramType'].setValue(selectedService.paramType);
      this.f['jsonFormat'].setValue(selectedService.jsonFormat);
      this.f['name'].setValue(selectedService.name);
      this.f['questionToGetInput'].setValue(selectedService.questionToGetInput);
      this.f['in'].setValue(selectedService.type);
    
    
    
      // Log the form values after setting them
      //console.log('Form Values After:', this.serviceParameterForm.value);
    }
  



 
onDropdownClick() {
  this.dropdownClicked = true;
}



remove(field:string){ 
  alert(field)
 }

getServiceParmeter(id:number){
  this.serciceParameterService.fetchServiceParameter(id) 

    .subscribe(r=>{        

        if (r.errorCode != undefined && r.errorCode != 200) {
          this.notifire.notify('error','Something went wrong. please try again in sometime') ;  
        } else {
          this.originalServiceParameter = r.data;
        }
    });
}
onSubmit() {  
  alert('submitted');
  if (this.serviceParameterForm.invalid) {     
    this.notifire.notify('error','invalid input');
    return;
  }
  this.submitted = true;
  const serviceParameter: ServiceParameter = {} as ServiceParameter; 
    var question = this.f['questionToGetInput'].value; 
     
    serviceParameter.serviceId = this.f['serviceId'].value;
    serviceParameter.description = this.f['description'].value; 
    serviceParameter.jsonFormat = this.f['jsonFormat'].value; 
    serviceParameter.required = this.f['required'].value; 
    serviceParameter.type= this.f['type'].value; 
    serviceParameter.in= this.f['type'].value; 
    serviceParameter.paramType = this.f['paramType'].value;
    serviceParameter.name = this.f['name'].value; 
    serviceParameter.questionToGetInput =   question.split(',');


   
if(this.isOnboard){
  this.serviceParameterService.onBoard(serviceParameter)
    .subscribe((r) => {
      if (r.errorCode != undefined && r.errorCode != 200) {
        this.notifire.notify('error','Not able to onboard. Please try again later.');
      } else {
        this.notifire.notify('success','Successfully onboarded.');
        this.originalServiceParameter.push(r);
      }
      this.submitted = false;
    },
    (error) => {       
      this.notifire.notify('error','An error occurred while communicating with the API.');
      this.submitted = false;
    }
  );
}else{
  this.serciceParameterService.editServiceParameter(serviceParameter).subscribe(
    (r) => {
      if (r.errorCode != undefined && r.errorCode != 200) {
        this.notifire.notify('error','Not able to edit. Please try again later.');
      } else {
        this.notifire.notify('success','Successfully edited.');
       // this.originalServiceParameter.push(r);
      }
      this.submitted = false;
    },
    (error) => {       
      this.notifire.notify('error','An error occurred while communicating with the API.');
      this.submitted = false;
    }
  );
  
  }

 
    
}

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template:`<h2 mat-dialog-title>Search</h2>
  <div  style="width: 100%;">
     
    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.name" placeholder="Name"/>      
    </mat-form-field>

    <mat-form-field style="width: 300px;">
      <input matInput   [(ngModel)]="data.description" placeholder="Method"/>      
    </mat-form-field>

    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.required" placeholder="EndPoint"/>      
    </mat-form-field>  
    

  </div>
  <div mat-dialog-actions> 
    <button class="btn btn-primary" mat-button [mat-dialog-close]="data" cdkFocusInitial>Search</button>
  </div>`
})
export class ServiceParameterSearchDialog {

  constructor(
    public dialogRef: MatDialogRef<ServiceParameterSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceParameterSearch) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}