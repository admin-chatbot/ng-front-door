import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service';
import { ApplicationService } from '../application/application.service';
import { Application } from 'src/app/entity/application';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/common/data.service';
import { NotifierService } from 'angular-notifier'; 
import { ApplicationSearch } from 'src/app/entity/applicationSearch';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { CommonService } from 'src/app/services/common.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

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
  styleUrls: ['./view-application.component.css'],  
})
export class ViewApplicationComponent implements OnInit ,AfterViewInit{

  displayedColumns: string[] = ['name', 'purpose', 'sourceUrl', 'registerDate',"status","serviceCount","id"];
  dataSource = new MatTableDataSource<Application>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  appSearch:ApplicationSearch = {} as ApplicationSearch;
  searchMap = new Map();
  isSearch:boolean = false;


  private notifier: NotifierService;

  


  constructor(private router: Router, private route: ActivatedRoute, private applicationService:ApplicationService,
    private formBuilder: FormBuilder,private messageService: MessageService,
    private dataService: DataService,notifier: NotifierService, private dialog: MatDialog,
    public commonService:CommonService 
    ) {
      this.clientId=localStorage.getItem('id');
     
   
    this.getApplicationsByClientIdAndStatus(this.clientId,"ACTIVE") ;
         
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
   }
  ngAfterViewInit(): void {    
    this.dataSource.paginator = this.paginator;     
  }


  remove(field: string){ 
    console.log("In remove single field");
    if(this.searchMap.has(field)) {
        this.searchMap.delete(field);
    }
    // Create a copy of searchMap to exclude clientId
    const searchParams = Object.fromEntries(this.searchMap);
    delete searchParams['clientId'];

    // Assign the modified searchParams to appSearch
    this.appSearch = searchParams;
    this.appSearch.clientId = this.clientId;

    console.log("searchParams");
    console.log(JSON.stringify(searchParams));
    if(Object.keys(searchParams).length === 1) {
        // If no other filters exist, fetch applications by clientId and status
        this.getApplicationsByClientIdAndStatus(this.clientId,"ACTIVE");
        this.isSearch = false;
    } else {
        console.log(JSON.stringify(this.appSearch));
        this.applicationService.search(this.appSearch)
            .subscribe(res => {
                console.log(res);
                if (res.errorCode != undefined && res.errorCode != 200) { 
                    this.notifier.notify('error','Not able to onboard. please try again in sometime');         
                } else {
                    this.originalApplication = res.data; 
                    this.dataSource.data = res.data;
                }           
            }); 
    }
}  

  clearAllFilters() {
    // Clear all filters and display default records
    this.searchMap.clear();

    this.appSearch = {
      clientId: this.clientId,
      purpose: '',
      name: '',
      toDate: '',
      fromDate: '',
      status: 'ACTIVE'
    };

    this.isSearch = false; // Reset the search flag
    // Fetch default records or perform any other necessary actions
    this.getApplicationsByClientIdAndStatus(this.clientId, "ACTIVE");
  }

   openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationSearchDialog, {
      width: '380px',
      data: this.appSearch
    });

    dialogRef.afterClosed().subscribe(r => {
      console.log('The dialog was closed');
      if(r!=undefined){ 
        this.appSearch = r; 
        this.appSearch.clientId = this.clientId;
        console.log(JSON.stringify(this.appSearch));
        this.applicationService.search(this.appSearch)
          .subscribe(res=>{
            console.log(JSON.stringify(res));
            if (res.code != undefined && res.code != 200) { 
              this.notifier.notify('error','Not able to onboard. please try again in sometime');         
            } else {
              //console.log(JSON.stringify(res.data));
              this.originalApplication = res.data; 
              this.dataSource.data = res.data;
              //console.log(JSON.stringify(this.dataSource));

            }           
          });
        this.searchMap = new Map(Object.entries(r));
        this.isSearch = true; 
      }
    });
  }

   get f() { return this.applicationForm.controls; }

  ngOnInit(): void {
       
  }
 

 
  getApplicationsByClientIdAndStatus(id:number,status:string){
    this.applicationService.fetchApplicationByClientAndStatus(id,status)
      .subscribe(r=>{ 
          this.originalApplication = r.data;
          this.dataSource.data = r.data;
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
     this.originalApplication.forEach(a=>{
      if(a.id == i) {
        this.application = a;
        return;
      }
    })
    this.f['id'].setValue( this.application.id)
    this.f['name'].setValue( this.application.name)
    this.f['purpose'].setValue( this.application.purpose)
    this.f['sourceUrl'].setValue( this.application.sourceUrl)
    this.f['serviceDocUrl'].setValue( this.application.serviceDocUrl)
    this.f['date'].setValue(this.formatDate(this.application.registerDate));
    this.f['status'].setValue( this.application.status)
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
      application.registerDate = this.f['date'].value;
      this.applicationService.edit(application)
      .subscribe(r=>{ 
        if (r.errorCode != undefined && r.errorCode != 200) { 
          this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
        } else {
          this.notifier.notify('success','Successfully Update Application')
          //this.getApplicationsByClientIdAndStatus(this.clientId,"ACTIVE");
        }
         
      });
    }    
    this.submitted = false;
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
     
  <div class="example-form-fields">
      
    <mat-form-field style="width: 320px;">      
      <input matInput [(ngModel)]="data.name" placeholder="Name"/>      
    </mat-form-field>
  </div>

  <div class="example-form-fields">
     <mat-form-field style="width: 320px;">
      <input matInput   [(ngModel)]="data.purpose" placeholder="Purpose"/>      
    </mat-form-field>
  </div>

  <div class="example-form-fields">     
    <mat-form-field style="width: 320px;"> 
        <mat-select [(ngModel)]="data.status" placeholder="Status"> 
          <mat-option *ngFor="let s of this.commonService.status" value="{{s}}">{{s | uppercase}}</mat-option> 
        </mat-select>       
    </mat-form-field>
  </div>

    <mat-form-field style="width: 320px;">
      <input matInput [matDatepicker]="pickerStart" [(ngModel)]="data.toDate" placeholder="Choose start date">
      <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
      <mat-datepicker #pickerStart></mat-datepicker>
    </mat-form-field>

    <mat-form-field style="width: 320px;">
      <input matInput [matDatepicker]="pickerEnd" [(ngModel)]="data.fromDate" placeholder="Choose end date">
      <mat-datepicker-toggle matSuffix [for]="pickerEnd" ></mat-datepicker-toggle>
      <mat-datepicker #pickerEnd ></mat-datepicker>
    </mat-form-field>

    

  </div>
  <div mat-dialog-actions> 
    <button class="btn btn-primary" mat-button [mat-dialog-close]="data" cdkFocusInitial>Search</button>
  </div>`
})
export class ApplicationSearchDialog {

  constructor(
    public dialogRef: MatDialogRef<ApplicationSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationSearchData,public commonService:CommonService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedStringOption = this.commonService.stringFilterOperations[0].value;

 
}
