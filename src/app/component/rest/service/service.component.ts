import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './service.service';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  serviceForm: FormGroup;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  responseTypes: string[] = ['application/json', 'application/xml'];
  submitted = false;
  dropdownClicked = false;
  constructor(private router: Router, private route: ActivatedRoute, 
    private serviceService:ServiceService,private formBuilder: FormBuilder,
    private messageService: MessageService) { 
      this.serviceForm = this.formBuilder.group({
        clientId: ['client12', [Validators.required]],
        applicationId: ['1', [Validators.required]], 
        method:['',Validators.required],
        endpoint:['http:/client/v1',Validators.required],
        name:['servive',Validators.required],
        responseTypes: [[]],
      });

    }

    get f() { return this.serviceForm.controls; }

  ngOnInit(): void {
  }
  onDropdownClick() {
    this.dropdownClicked = true;
  }

  onSubmit() {    
    if (this.serviceForm.invalid) { 
      alert('invalid input')
      return;
    }
    this.submitted = true;
    const service: Service = {} as Service;

    service.clientId = this.f['clientId'].value;
    service.applicationId  = this.f['applicationId'].value;
    service.endpoint = this.f['endpoint'].value; 
    service.method = this.f['method'].value;   
    service.name = this.f['name'].value
    service.reponseType = this.f['responseTypes'].value;

    

    this.serviceService.onBoard(service)
      .subscribe(r=>{
        console.log(JSON.stringify(r));
        if (r.errorCode != undefined && r.errorCode != 200) { 
          alert('Not able to onboard. please try again in sometime')           
        } else {
          alert('Successfully on board')
        }
        this.submitted = false;
      });
  }

}
