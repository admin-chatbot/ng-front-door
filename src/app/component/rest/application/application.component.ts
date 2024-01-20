import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from './application.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/http/message.service'; 
import { Application } from 'src/app/entity/application';
import { DataService } from 'src/app/common/data.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  applicationForm: FormGroup;
  clientId:any;

  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private applicationService:ApplicationService,private formBuilder: FormBuilder,
    private messageService: MessageService,private dataService: DataService) { 
      this.applicationForm = this.formBuilder.group({
        name: ['name', [Validators.required]],
        purpose: ['purpose', [Validators.required]], 
        sourceUrl:['sourceUrl',Validators.required],
        serviceDocUrl:['serviceDocUrl',Validators.required]
      });
     this.clientId=localStorage.getItem('id');
    }

    get f() { return this.applicationForm.controls; }

  ngOnInit(): void {
  }

 


  onSubmit() {    
    if (this.applicationForm.invalid) {       
      alert('invalid input')
      return;
    }
    this.submitted = true;
    const application: Application = {} as Application;
    
    application.name = this.f['name'].value;
    application.purpose  = this.f['purpose'].value;
    application.sourceUrl = this.f['sourceUrl'].value;
    application.serviceDocUrl = this.f['serviceDocUrl'].value;
    application.clintId = Number.parseInt(this.clientId);

    

    this.applicationService.onBoard(application)
      .subscribe(r=>{ 
        if (r.errorCode != undefined && r.errorCode != 200) {  
          alert('Not able to onboard. please try again in sometime')           
        } else {
          alert('Successfully on board')
        }
        this.submitted = false;
      });
  }

}
