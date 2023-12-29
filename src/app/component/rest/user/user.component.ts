import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { User } from 'src/app/entity/user';
import { MessageService } from 'src/app/http/message.service';

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

  constructor(private router: Router, private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dataService: DataService) { 
      this.userForm = this.formBuilder.group({
        id: ['0', [Validators.required]],
        name: ['name', [Validators.required]],
        email: ['email@gmail.com', [Validators.required]], 
        mobileNumber:['9769160936',Validators.required],
        accessType:['USER',Validators.required],
        clientId:['',Validators.required], 
        status:['ACTIVE',Validators.required], 
        empId:['FB098789',Validators.required]
      });
    }


  get f() { return this.userForm.controls; }
  ngOnInit(): void {
  }

  onSubmit() {}

  view(id:number) {}

  clear(){}

}
