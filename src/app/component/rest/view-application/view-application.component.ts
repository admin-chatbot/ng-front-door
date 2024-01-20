import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service';
import { ApplicationService } from '../application/application.service';
import { Application } from 'src/app/entity/application';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/common/data.service';
import { NotifierService } from 'angular-notifier'; 
import { ApplicationSearch } from 'src/app/entity/applicationSearch';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';

export interface ApplicationSearchData {
  purpose: string;
  name: string;
  toDate: string;
  fromDate: string;
  status: string;
}


@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css']
})
export class ViewApplicationComponent implements OnInit {

  originalApplication: Application[] = [];
  applicationForm: FormGroup;
  application = {} as Application;
  submitted:boolean = false;

  isOnBoard: boolean = true;
  submitButtonName:string = "On Board";
  heading:string = "ON BOARD APPLICATION";
  clientId:any;
  cancelButtonName = "Clear";
  statusDisabled = "disabled";
  isDateFieldDisabled: boolean = true;
  searchKeyword: string = ""

  appSearch:ApplicationSearch = {} as ApplicationSearch;
  searchMap = new Map();
  isSearch:boolean = false;


  private notifier: NotifierService;

  status: string[] = ['NEW', 'REVIEW', 'ACTIVE','HOLD', 'INACTIVE']; 


  constructor(private router: Router, private route: ActivatedRoute, private applicationService:ApplicationService,
    private formBuilder: FormBuilder,private messageService: MessageService,private dataService: DataService,notifier: NotifierService, private dialog: MatDialog) {
   
    this.getApplications();      
    this.notifier = notifier;
    this.applicationForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      purpose: ['', [Validators.required]], 
      sourceUrl:['',Validators.required],
      serviceDocUrl:['',Validators.required],
      date:[''],
      status:['NEW',Validators.required]
    });

    this.clientId=localStorage.getItem('id');
   }

   remove(field:string){ 
    alert(field)
   }

   openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationSearchDialog, {
      width: '350px',
      data: this.appSearch
    });

    dialogRef.afterClosed().subscribe(r => {
      console.log('The dialog was closed');
      if(r!=undefined){
        alert(JSON.stringify(r));
        this.appSearch = r;
        this.searchMap = new Map(Object.entries(r));
        this.isSearch = true;
      }
    });
  }

   get f() { return this.applicationForm.controls; }

  ngOnInit(): void {
       
  }
 

  getApplications(){
    this.applicationService.fetchApplication()
      .subscribe(r=>{ 
          this.originalApplication = r.data;
      });
  }

  fetch(application:number,url:string) {  
    this.dataService.changeUrl(url);
    this.router.navigate(['main/auto/discover'],{ state: { docUrl: url,applicaionId:application } }) ;
  }

  view(i:number){

    this.submitButtonName = "Edit";
    this.isOnBoard = false;
    this.cancelButtonName = "Cancel"
    this.heading = "EDIT APPLICATION"
    this.application = this.originalApplication[i];
    this.f['id'].setValue( this.application.id)
    this.f['name'].setValue( this.application.name)
    this.f['purpose'].setValue( this.application.purpose)
    this.f['sourceUrl'].setValue( this.application.sourceUrl)
    this.f['serviceDocUrl'].setValue( this.application.serviceDocUrl)
    this.f['date'].setValue(this.application.registerDate)
    this.f['status'].setValue( this.application.status)
  }

  clear() {
    if(!this.isOnBoard) {
      this.submitButtonName = "On Board";
      this.isOnBoard = true;
      this.cancelButtonName = "Clear";
      this.heading = "ON BOARD APPLICATION";
    }
    this.applicationForm.reset();
    this.f['status'].setValue( "NEW")
  }

  search() {
    alert(this.searchKeyword)
  }

  onSubmit() {    
    if (this.applicationForm.invalid) {   
      this.notifier.notify( "error", "All field are required." );
      return;
    }
    this.submitted = true;
    const application: Application = {} as Application;
    
    application.name = this.f['name'].value;
    application.purpose  = this.f['purpose'].value;
    application.sourceUrl = this.f['sourceUrl'].value;
    application.serviceDocUrl = this.f['serviceDocUrl'].value;
    application.clintId = Number.parseInt(this.clientId);
    application.status = this.f['status'].value
    application.id = this.f['id'].value;

    
    if(this.isOnBoard) {
      this.applicationService.onBoard(application)
        .subscribe(r=>{  
          if (r.errorCode != undefined && r.errorCode != 200) { 
            this.notifier.notify('error',r.errorMessage)           
          } else {                 
              this.notifier.notify('success',r.message);
              this.originalApplication.push(r.data);
              this.submitted = false;
              this.applicationForm.reset();
          }          
        });
    } else {
      this.applicationService.edit(application)
      .subscribe(r=>{ 
        if (r.errorCode != undefined && r.errorCode != 200) { 
          this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
        } else {
          this.notifier.notify('success','Successfully Update Application')
          this.getApplications();
        }
        this.submitted = false; 
      });
    }    
  }

  openService(applicationId:number) {
    this.router.navigate(['main/service'],{ state: { appId: applicationId } }) ;
  }

  subString(date:string):string {
    if(date!=undefined) {
      return date.substring(0,10);
    }
    return "";
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
      <input matInput   [(ngModel)]="data.purpose" placeholder="Purpose"/>      
    </mat-form-field>

    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.status" placeholder="Status"/>      
    </mat-form-field>

    <mat-form-field style="width: 300px;">
      <input matInput [matDatepicker]="pickerStart" placeholder="Choose start date">
      <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
      <mat-datepicker #pickerStart></mat-datepicker>
    </mat-form-field>

    <mat-form-field style="width: 300px;">
      <input matInput [matDatepicker]="pickerEnd" placeholder="Choose end date">
      <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
      <mat-datepicker #pickerEnd></mat-datepicker>
    </mat-form-field>

    

  </div>
  <div mat-dialog-actions> 
    <button class="btn btn-primary" mat-button [mat-dialog-close]="data" cdkFocusInitial>Search</button>
  </div>`
})
export class ApplicationSearchDialog {

  constructor(
    public dialogRef: MatDialogRef<ApplicationSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationSearchData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
