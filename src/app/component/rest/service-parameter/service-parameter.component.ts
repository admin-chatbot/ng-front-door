import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ServiceParameter } from '../service-parameter/service-parameter.service';
import { ServiceParameterService } from '../service-parameter/service-parameter.service'
import { ServiceParameter } from 'src/app/entity/serviceParameters';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service'; 
import { Type } from '@angular/compiler';
import { SelectedService } from 'src/app/entity/selectedService';
import { Service } from 'src/app/entity/service';

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
  type: string[] = ['header','body']
  paramType: string[] = ['string','int']
  questionAsked: string[] = ['Yes','No']
  submitted = false;
  dropdownClicked = false;
 
  //service:Service [] = [];
  //responseType:string[] = [];
  //requestType:string[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private serviceParameterService: ServiceParameterService,  // Make sure this is included
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serciceParameterService: ServiceParameterService) {
    var dataRecived : any = this.router.getCurrentNavigation()?.extras.state;
      this.serviceId=dataRecived.id;
      //this.serviceId=localStorage.getItem('id');
      alert('the service id is'+this.serviceId);
      this.serviceParameterForm = this.formBuilder.group({
        id: ['0', Validators.required],
        description: ['', [Validators.required]],
        required: ['', Validators.required],
        type: ['', Validators.required],
        paramType: ['', Validators.required],
        jsonFormat: ['', Validators.required],
        name: ['', Validators.required],
        questionToGetInput:['', Validators.required]
    });
      
        
        
      
      
 
      this.getServiceParmeter();
      

      //this.f['responseTypes'].valueChanges.subscribe(v=>{
       // this.responseType = v;
      //});

      //this.f['requestTypes'].valueChanges.subscribe(v=>{
      //  this.requestType = v;
      //});
      

    }
   
    
    ngOnInit(): void {
      this.getServiceParmeter();
  }

    get f() { return this.serviceParameterForm.controls; }
    
    view(i: number) {
      this.isOnboard = false;
      this.submitButtonName = 'Edit';   
      const selectedService = this.originalServiceParameter[i];   
    
      this.f['id'].setValue(selectedService.id);
      this.f['description'].setValue(selectedService.description);
      this.f['required'].setValue(selectedService.required);
      this.f['type'].setValue(selectedService.type);
      this.f['paramType'].setValue(selectedService.paramType);
      this.f['jsonFormat'].setValue(selectedService.jsonFormat);
      this.f['name'].setValue(selectedService.name);
      this.f['questionToGetInput'].setValue(selectedService.questionToGetInput);
    
    
    
      // Log the form values after setting them
      console.log('Form Values After:', this.serviceParameterForm.value);
    }
  



 
onDropdownClick() {
  this.dropdownClicked = true;
}

getServiceParmeter(){
  this.serciceParameterService.fetchServiceParameter()
    .subscribe(r=>{ 
       
        if (r.errorCode != undefined && r.errorCode != 200) {
         console.log('error')
        } else {
          this.originalServiceParameter = r;
        }
    });
}
onSubmit() {  
  alert('submitted');
  if (this.serviceParameterForm.invalid) { 
    console.log('Form values:', this.serviceParameterForm.value);
    alert('invalid input');
    return;
  }
  this.submitted = true;
  const serviceParameter: ServiceParameter = {} as ServiceParameter;  
    serviceParameter.description = this.f['description'].value; 
    serviceParameter.jsonFormat = this.f['jsonFormat'].value; 
    serviceParameter.required = this.f['required'].value; 
    serviceParameter.type= this.f['type'].value; 
    serviceParameter.paramType = this.f['parmType'].value; 
    serviceParameter.name = this.f['name'].value; 
    serviceParameter.questionToGetInput = this.f['questionToGetInput'].value; 

   
if(this.isOnboard){
  this.serviceParameterService.onBoard(serviceParameter)
    .subscribe((r) => {
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
  this.serciceParameterService.editServiceParameter(serviceParameter).subscribe(
    (r) => {
      if (r.errorCode != undefined && r.errorCode != 200) {
        alert('Not able to edit. Please try again later.');
      } else {
        alert('Successfully edited.');
      }
      this.submitted = false;
    },
    (error) => {
      console.error('API Error:', error);
      alert('An error occurred while communicating with the API.');
      this.submitted = false;
    }
  );
  
  }

 
    
}}