import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { User } from 'src/app/entity/user';
import { MessageService } from 'src/app/http/message.service';
import { UserService } from './user.service';
import { UserSearch } from 'src/app/entity/userSearch';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'; 
import { Application } from 'src/app/entity/application';

export interface UserSearchData { 
  empId: string;
    name: string;
    email: string;
    mobile: string;
    access: string;
    status: string;
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'], 
})
export class UserComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ["empId", "name", "email", "mobileNumber","accessType","status","id"];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  applications: Application[] = [];
  originalUser: User[] = [];
  submitted:boolean = false;
  userForm:FormGroup;
  users:User[] = []
  user = {} as User
  heading:string = "Register New User";
  isOnBoard:boolean = true;
  submitButtonName:string = "Register";
  cancelButtonName:string = "Clear";
  accesTypes: string[] = ['ADMIN', 'USER']; 
  clientId!:any;
  status: string[] = ['NEW', 'REVIEW', 'ACTIVE','HOLD', 'INACTIVE']; // Add more methods as needed
  usrSearch:UserSearch = {} as UserSearch;
  searchMap = new Map();
  isSearch:boolean = false;
  userSearch:UserSearch = {} as UserSearch;
  private notifier: NotifierService;

  constructor(private router: Router, private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private userService:UserService, 
    notifier:NotifierService,
    private dialog: MatDialog,
    public commonService:CommonService
    ) { 

      this.clientId = localStorage.getItem('id');
      //this.fetchByClient(this.clientId);
      
      this.getUsersByClientIdAndStatus(this.clientId,"ACTIVE") ;
      this.notifier = notifier;

      this.userForm = this.formBuilder.group({
        id: ['0', [Validators.required]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required]], 
        mobileNumber:['',Validators.required],
        accessType:['USER',Validators.required], 
        status:['ACTIVE',Validators.required], 
        applicationName:['',Validators.required],
        empId:['',Validators.required]
      });
    }
    ngAfterViewInit(): void {    
      this.dataSource.paginator = this.paginator;     
    }


    
    openDialog(): void {
      const dialogRef = this.dialog.open(UserSearchDialog, {
        width: '350px',
        data: this.usrSearch
      });
  
      dialogRef.afterClosed().subscribe(r => {
        console.log('The dialog was closed');
        if(r!=undefined){ 
          this.usrSearch = r;
          
          this.usrSearch.clientId = this.clientId;
          
          this.userService.search(this.usrSearch)
            .subscribe(res=>{
              if (res.errorCode != undefined && res.errorCode != 200) { 
                this.notifier.notify('error','Not able to onboard. please try again in sometime') ;         
              } else {
                this.originalUser = res.data; 
                this.dataSource.data = res.data;
              }           
            });
          this.searchMap = new Map(Object.entries(r));
          this.isSearch = true; 
        }
      });
    }

  get f() { return this.userForm.controls; }

  ngOnInit(): void {
    this.fetchApplicationNames1();
  }

  fetchApplicationNames1() {
    this.userService.fetchApplicationNames1(this.clientId)
      .subscribe(
        (response) => {
          this.applications = response.data;
        },
        (error) => {
          console.error('Error fetching application names:', error);
        }
      );
  }
  
  onSubmit() { 

    if (this.userForm.invalid) {       
      this.notifier.notify('error','invalid input')
      return;
    }
    this.submitted = true;

    const user: User = {} as User;
    user.id = this.f['id'].value;
    user.name = this.f['name'].value;
    user.applications=this.f['applicationName'].value;
    user.accessType = this.f['accessType'].value;
    user.clientId = this.clientId;
    user.email = this.f['email'].value;
    user.empId = this.f['empId'].value;
    user.mobileNumber = this.f['mobileNumber'].value;
    user.status = this.f['status'].value;

    if(this.isOnBoard) {
      this.userService.register(user)
        .subscribe(res=>{
          if (res.errorCode != undefined && res.errorCode != 200) { 
            this.notifier.notify('error','Not able to register. please try again in sometime')           
          } else {
            this.notifier.notify('success','Successfully onboarded.');
            if(res.data!=undefined)
              this.users.push(res.data);
          }
          this.submitted = false;
          this.userForm.reset();
        });
    } else {

      this.userService.edit(user)
        
        .subscribe((res)=>{
          if (res.errorCode != undefined && res.errorCode != 200) { 
            this.notifier.notify('error','Not able to edit. please try again in sometime')           
          } else {
            this.notifier.notify('success','Successfully Edited..');
            //this.fetchByClient(this.clientId);
          }
          this.submitted = false;
          this.userForm.reset();
          this.f['status'].setValue( "NEW");
          this.f['accessType'].setValue( "USER");
        });      
    }

  }

  view(id:User) {
   
    this.submitButtonName = "Edit";
    this.isOnBoard = false;
    this.cancelButtonName = "Cancel";
    this.heading = "EDIT USER";
    var user : User = {} as User;
    user = id ; 
    this.f['id'].setValue(user.id );
    this.f['name'].setValue(user.name );
    this.f['accessType'].setValue(user.accessType );
    this.f['email'].setValue(user.email );
    this.f['empId'].setValue(user.empId );
    this.f['mobileNumber'].setValue(user.mobileNumber );
    this.f['applicationName'].setValue(user.applications)
    this.f['status'].setValue(user.status ); 
  }

  getUsersByClientIdAndStatus(id:number,status:string){
    this.userService.fetchUserByClientAndStatus(id,status)
      .subscribe(r=>{ 
          this.originalUser = r.data;
          this.dataSource.data = r.data;
      });
  } 

  fetch() { 
    this.userService.list()
      .subscribe((res)=>{        
        this.users = res.data;
      });
  }

  fetchByClient(id:number) { 
    this.userService.byClientId(id)
      .subscribe((res)=>{        
        this.users = res.data;
      });
  }


    remove(field: string) {
    if (this.searchMap.has(field)) {
      this.searchMap.delete(field);
    }
    this.userSearch = Object.fromEntries(this.searchMap);
    this.userSearch.clientId = this.clientId;

    const searchParams = Object.fromEntries(this.searchMap);
    delete searchParams['clientId'];


    if(Object.keys(searchParams).length === 0) {
      this.getUsersByClientIdAndStatus(this.clientId, "ACTIVE");
      this.isSearch = false;
    } else {
      this.userService.search(this.userSearch)
        .subscribe(res => {
          if (res.errorCode != undefined && res.errorCode != 200) {
            this.notifier.notify('error', 'Not able to onboard. please try again in sometime');
          } else {
            this.originalUser = res.data;
          }
        });
    }
  }   

  clear(){
    if(!this.isOnBoard) {
      this.submitButtonName = "On Board";
      this.isOnBoard = true;
      this.cancelButtonName = "Clear";
      this.heading = "ON BOARD APPLICATION";
    }
    this.userForm.reset();
    this.f['status'].setValue( "NEW");
    this.f['accessType'].setValue( "USER")
  }

  

}



@Component({
  selector: 'dialog-overview-example-dialog',
  template:`<h2 mat-dialog-title>Search</h2>
  <div  style="width: 100%;">
     
   

    <mat-form-field style="width: 300px;">
      <input matInput   [(ngModel)]="data.empId" placeholder="Emp ID"/>      
    </mat-form-field>
    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.name" placeholder="Name"/>      
    </mat-form-field>

    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.email" placeholder="Email"/>      
    </mat-form-field>  
    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.mobile" placeholder="Mobile"/>      
    </mat-form-field> 
    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.access" placeholder="Access"/>      
    </mat-form-field>
    <div class="example-form-fields">     
      <mat-form-field style="width: 320px;"> 
          <mat-select [(ngModel)]="data.status" placeholder="Status"> 
            <mat-option *ngFor="let s of this.commonService.status" value="{{s}}">{{s | uppercase}}</mat-option> 
          </mat-select>       
      </mat-form-field>
    </div>
    

  </div>
  <div mat-dialog-actions> 
    <button class="btn btn-primary" mat-button [mat-dialog-close]="data" cdkFocusInitial>Search</button>
  </div>`
})
export class UserSearchDialog {

  constructor(
    public dialogRef: MatDialogRef<UserSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserSearchData,public commonService:CommonService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedStringOption = this.commonService.stringFilterOperations[0].value;

}
