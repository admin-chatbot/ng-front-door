import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {
  
  email:any = 'Guest';

  constructor() { 
    if(localStorage.getItem('email')!=null){
      this.email = localStorage.getItem('email')
    }
    localStorage.clear();
  }

  ngOnInit(): void {
  }

}
