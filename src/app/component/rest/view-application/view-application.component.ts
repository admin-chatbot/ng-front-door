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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  id:number
} 

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H',id:1},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He',id:1},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li',id:1},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be',id:1},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B',id:1},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C',id:1},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N',id:1},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O',id:1},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F',id:1},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne',id:1},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na',id:1},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg',id:1},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al',id:1},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si',id:1},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P',id:1},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S',id:1},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl',id:1},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar',id:1},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K',id:1},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca',id:1},
];

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

   remove(field:string){ 
    if(this.searchMap.has(field)) {
      this.searchMap.delete(field);
    }
    this.appSearch = Object.fromEntries(this.searchMap);   
    this.appSearch.clientId = this.clientId;    
    if(this.searchMap.size == 0) {
      this.getApplicationsByClientIdAndStatus(this.clientId,"ACTIVE");
      this.isSearch = false;
    } else {
      this.applicationService.search(this.appSearch)
          .subscribe(res=>{
            if (res.errorCode != undefined && res.errorCode != 200) { 
              this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
            } else {
              this.originalApplication = res.data; 
              this.dataSource.data = res.data;
            }           
        }); 
    }
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
        this.applicationService.search(this.appSearch)
          .subscribe(res=>{
            if (res.errorCode != undefined && res.errorCode != 200) { 
              this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
            } else {
              this.originalApplication = res.data; 
              this.dataSource.data = r.data;
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
          this.getApplicationsByClientIdAndStatus(this.clientId,"ACTIVE");
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
        <mat-select [(ngModel)]="data.status"> 
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
