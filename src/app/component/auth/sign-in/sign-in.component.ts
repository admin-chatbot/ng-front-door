import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/entity/login';
import { MessageService } from 'src/app/http/message.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginForm: FormGroup;

  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, private messageService: MessageService
    ,private authService: AuthService) { 
    this.loginForm = this.formBuilder.group({
      email: ['jitendra.sagoriya@gmail.com', [Validators.required,Validators.email]],
      password: ['J1tendr@12', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.invalid) { 
      alert('All field are mandotery.')
      return;
    }
    this.submitted = true;
    const login : Login = {} as Login;

    login.email = this.f['email'].value;
    login.password = this.f['password'].value;

    this.authService.login(login)
      .subscribe(r=>{
        if (r.errorCode != undefined && r.errorCode != 200) { 
          alert(r)           
        } else {
          localStorage.setItem('isLoggedIn', "true")
          localStorage.setItem('token', r.data)
          alert(r.data)
          alert('Successfully login')
        }
        this.submitted = false;
      })

  }

}
