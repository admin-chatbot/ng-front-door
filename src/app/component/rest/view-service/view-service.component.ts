import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service';
import { ServiceService } from '../service/service.service';
import {Service} from 'src/app/entity/service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  dropdownClicked = false;
  originalService: Service[] = [];
  serviceEditForm: FormGroup;
  service = {} as Service;
  submitted:boolean = false;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  responseTypes: string[] = ['application/json', 'application/xml'];

  private notifier: NotifierService;

  constructor(private router: Router, private route: ActivatedRoute, private serviceService:ServiceService,private formBuilder: FormBuilder,
    private messageService: MessageService,notifier: NotifierService) {
    this.getServices();
    this.notifier = notifier;
    this.serviceEditForm = this.formBuilder.group({
      method:['',Validators.required],
        endpoint:['http:/client/v1',Validators.required],
        name:['servive',Validators.required],
        responseTypes: [[]],
    });
   }
   get f() { return this.serviceEditForm.controls; }


  ngOnInit(): void {
  }

  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

  onSubmit() {}
  getServices(){
    this.serviceService.fetchService()
      .subscribe(r=>{ 
          this.originalService = r;
      });
  }
  onDropdownClick() {
    this.dropdownClicked = true;
  }
  view(i:number){
    this.service = this.originalService[i];  
   
    this.f['endpoint'].setValue( this.service.endpoint)
    this.f['method'].setValue( this.service.method)
    this.f['name'].setValue( this.service.name)
    this.f['responseType'].setValue( this.service.responseType)
}

}
