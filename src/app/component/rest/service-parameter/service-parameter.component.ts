import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceParameter } from '../service-parameter/service-parameter.service';
import { ServiceParameterService } from '../service-parameter/service-parameter.service'
import { Service } from 'src/app/entity/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service'; 

@Component({
  selector: 'app-service-parameter',
  templateUrl: './service-parameter.component.html',
  styleUrls: ['./service-parameter.component.css']
})
export class ServiceParameterComponent implements OnInit {

  private isOnboard = true;
  submitButtonName = 'Submit';
  originalService: Service[]=[];
  service = {} as Service;
  clientId:any;
  serviceId:any;

  serviceParameterForm: FormGroup  ;
  required: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  type: string[] = ['header','body']
  paramtyp: string[] = ['string','int']
  questionAsked: string[] = ['Yes','No']
 
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
     
      this.clientId=localStorage.getItem('id');
      alert('the client id is'+this.clientId);
        this.serviceParameterForm = this.formBuilder.group({
        id: ['0',Validators.required],
        clientId: [this.clientId, [Validators.required]],
        applicationId: ['', [Validators.required]],
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
      
 
      
      

      //this.f['responseTypes'].valueChanges.subscribe(v=>{
       // this.responseType = v;
      //});

      //this.f['requestTypes'].valueChanges.subscribe(v=>{
      //  this.requestType = v;
      //});
      

    }

    
      ngOnInit(): void {
  }

    get f() { return this.serviceParameterForm.controls; }
    
    

  



addParameter(serviceId:number){
  alert(serviceId);
  this.router.navigate(['main/parameter'],{ state: { id: serviceId } }) ;
}
 


onSubmit() {    
  if (this.serviceParameterForm.invalid) { 
    console.log('Form values:', this.serviceParameterForm.value);
    alert('invalid input');
    return;
  }

  this.serviceParameterService.onBoard(this.serviceParameterForm.value)
    .subscribe(response => {
      // Handle the response here
      console.log('Service onBoard response:', response);
    }, error => {
      // Handle the error here
      console.error('Error on onBoard service:', error);
    });
}

  
    
  }