import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service';
import { ApplicationService } from '../application/application.service';
import { Application } from 'src/app/entity/application';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/common/data.service';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css']
})
export class ViewApplicationComponent implements OnInit {

  originalApplication: Application[] = [];
  applicationEditForm: FormGroup;
  application = {} as Application;
  submitted:boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private applicationService:ApplicationService,private formBuilder: FormBuilder,private messageService: MessageService,private dataService: DataService) {
    this.getApplications(); 

     
    
    this.applicationEditForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      purpose: ['', [Validators.required]], 
      sourceUrl:['',Validators.required],
      serviceDocUrl:['',Validators.required],
      status:['',Validators.required]
    });
   }

   get f() { return this.applicationEditForm.controls; }

  ngOnInit(): void {
       
  }
  onSubmit() {}

  getApplications(){
    this.applicationService.fetchApplication()
      .subscribe(r=>{ 
          this.originalApplication = r;
      });
  }

  fetch(application:number,url:string) {  
    this.dataService.changeUrl(url);
    this.router.navigate(['main/auto/discover'],{ state: { docUrl: url,applicaionId:application } }) ;
  }

  view(i:number){
      this.application = this.originalApplication[i];
      this.f['name'].setValue( this.application.name)
      this.f['purpose'].setValue( this.application.purpose)
      this.f['sourceUrl'].setValue( this.application.sourceUrl)
      this.f['serviceDocUrl'].setValue( this.application.serviceDocUrl)
      this.f['status'].setValue( this.application.status)
  }



}
