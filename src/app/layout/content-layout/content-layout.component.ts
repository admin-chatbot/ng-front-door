import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})
export class ContentLayoutComponent implements OnInit {

  isLoggedIn:boolean = false;
  userName:any = "";

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.isLoggedIn = this.checkLogin();

    if(this.isLoggedIn) {
       if(localStorage.getItem('name')!=null){
        this.userName = localStorage.getItem('name');  
       } else {
        this.userName = "Guest"
       }
    }
  }

  ngOnInit(): void {
  }


  logout(){ 
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }

  public checkLogin(): boolean {
    let status = false;
    if (localStorage.getItem('isLoggedIn') == "true") {
        status = true;
    }
    else {
        status = false;
    }
    return status;
  }

}
