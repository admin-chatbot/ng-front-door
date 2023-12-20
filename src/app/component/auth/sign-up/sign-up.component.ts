import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Signup } from 'src/app/entity/signup';
import { MessageService } from 'src/app/http/message.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;

  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, private messageService: MessageService
    ,private authService: AuthService) { 
    this.signupForm = this.formBuilder.group({
        name: ['client32', [Validators.required]],
        email: ['client32@gmail.com', [Validators.required]], 
        password:['client@123',Validators.required],
        retypePassword:['client@123',Validators.required],
        address: ['mumbai', [Validators.required]],
        contactNumber: ['9999999999', [Validators.required]], 
        turnover:['12',Validators.required],
        employeeCount:['12',Validators.required],
        gstNumber:['GST1234',Validators.required]
      });
  }

  get f() { return this.signupForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    alert("clicked")
    if (this.signupForm.invalid) { 
      alert('All field are mandotery.')
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
   
    alert(JSON.stringify(signup))

    this.authService.signup(signup)
    .subscribe(r=>{
      console.log(JSON.stringify(r));
      if (r.errorCode != undefined && r.errorCode != 200) { 
        alert('Not able to onboard. please try again in sometime')           
      } else {
        alert('Successfully on board')
      }
      this.submitted = false;
    });
}

}


