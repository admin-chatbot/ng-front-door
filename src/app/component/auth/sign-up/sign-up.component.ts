import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Signup } from 'src/app/entity/signup';
import { MessageService } from 'src/app/http/message.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;

  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, private messageService: MessageService
    ,private authService: AuthService,private notifier:NotifierService) { 
    this.signupForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required]], 
        password:['',Validators.required],
        retypePassword:['',Validators.required],
        address: ['', [Validators.required]],
        contactNumber: ['', [Validators.required]], 
        turnover:['',Validators.required],
        employeeCount:['',Validators.required],
        gstNumber:['',Validators.required]
      });
  }

  get f() { return this.signupForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    
    if (this.signupForm.invalid) { 
      this.notifier.notify('error','All field are mandotery.')
      return;
    }
    this.submitted = true;
    const signup : Signup = {} as Signup;
   
    
    signup.clientName = this.f['name'].value;
    signup.email = this.f['email'].value;
    signup.password = this.f['password'].value;   
    signup.address = this.f['address'].value;
    signup.contactNumber = this.f['contactNumber'].value;
    signup.turnover = this.f['turnover'].value;
    signup.employeeCount = this.f['employeeCount'].value;
    signup.gstNumber = this.f['gstNumber'].value;
   
    

    this.authService.signup(signup)
    .subscribe(r=>{
      console.log(JSON.stringify(r));
      if (r.errorCode != undefined && r.errorCode != 200) { 
        this.notifier.notify('error','Not able to onboard. please try again in sometime')           
      } else {
        localStorage.setItem('email',signup.email)        
        this.router.navigate(['auth/signup-success'])
      }
      this.submitted = false;
    });
}

}


