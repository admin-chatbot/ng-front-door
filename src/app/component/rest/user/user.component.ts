import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { User } from 'src/app/entity/user';
import { MessageService } from 'src/app/http/message.service';
import { UserService } from './user.service';
import { UserSearch } from 'src/app/entity/userSearch';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  submitted:boolean = false;
  userForm:FormGroup;
  users:User[] = []
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
  constructor(private router: Router, private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService:UserService,
    private dataService: DataService,
    private notifire:NotifierService,private dialog: MatDialog) { 

      this.clientId = localStorage.getItem('id');
      this.fetchByClient(this.clientId);

      this.userForm = this.formBuilder.group({
        id: ['0', [Validators.required]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required]], 
        mobileNumber:['',Validators.required],
        accessType:['USER',Validators.required], 
        status:['ACTIVE',Validators.required], 
        empId:['',Validators.required]
      });
    }
    openDialog(): void {
      const dialogRef = this.dialog.open(UserSearchDialog, {
        width: '350px',
        data: this.usrSearch
      });
  
      dialogRef.afterClosed().subscribe(r => {
        console.log('The dialog was closed');
        if(r!=undefined){
          alert(JSON.stringify(r));
          this.usrSearch = r;
          this.searchMap = new Map(Object.entries(r));
          this.isSearch = true;
        }
      });
    }

  get f() { return this.userForm.controls; }
  ngOnInit(): void {
  }

  onSubmit() { 

    if (this.userForm.invalid) {       
      this.notifire.notify('error','invalid input')
      return;
    }
    this.submitted = true;

    const user: User = {} as User;
    user.id = this.f['id'].value;
    user.name = this.f['name'].value;
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
            this.notifire.notify('error','Not able to register. please try again in sometime')           
          } else {
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
            this.notifire.notify('error','Not able to edit. please try again in sometime')           
          } else {
            this.notifire.notify('success','Successfully Edited..');
            this.fetchByClient(this.clientId);
          }
        });

      this.submitted = false;
      this.userForm.reset();
      this.f['status'].setValue( "NEW");
      this.f['accessType'].setValue( "USER");
    }

  }

  view(id:number) {
    alert(id)
    this.submitButtonName = "Edit";
    this.isOnBoard = false;
    this.cancelButtonName = "Cancel";
    this.heading = "EDIT USER";

    var user : User = {} as User;
    user = this.users[id] ;
    this.f['id'].setValue(user.id );
    this.f['name'].setValue(user.name );
    this.f['accessType'].setValue(user.accessType );
    this.f['email'].setValue(user.email );
    this.f['empId'].setValue(user.empId );
    this.f['mobileNumber'].setValue(user.mobileNumber );
    this.f['status'].setValue(user.status ); 
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

  remove(field:string){ 
    alert(field)
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
      <input matInput   [(ngModel)]="data.empId" placeholder="Method"/>      
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
    <mat-form-field style="width: 300px;">
      <input matInput [(ngModel)]="data.status" placeholder="Status"/>      
    </mat-form-field>
    

  </div>
  <div mat-dialog-actions> 
    <button class="btn btn-primary" mat-button [mat-dialog-close]="data" cdkFocusInitial>Search</button>
  </div>`
})
export class UserSearchDialog {

  constructor(
    public dialogRef: MatDialogRef<UserSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserSearchData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}