import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dashboard } from 'src/app/entity/dashboard';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  originalService: Dashboard[]=[]
  
  dashboardForm: FormGroup;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']; // Add more methods as needed
  responseTypes: string[] = ['application/json', 'application/xml'];
  //submitted = false;
  //dropdownClicked = false;
  //applications:Application [] = [];
  dashboard:Dashboard;
  responseType:string[] = [];
  requestType:string[] = [];
  constructor(private router: Router, private route: ActivatedRoute, 
    private dashboardService:DashboardService,private formBuilder: FormBuilder,
    private messageService: MessageService) { 
      this.dashboardForm = this.formBuilder.group({
        applicationCount: [],
        serviceCount: [],
        topUsed10Services: [],
        leastUsed10Services: [],
        mostActiveClient: [],
        leastActiveClient: []       
      });

      this.fetchDashboard();     

      this.f['responseTypes'].valueChanges.subscribe(v=>{
        this.responseType = v;
      });

      this.f['requestTypes'].valueChanges.subscribe(v=>{
        this.requestType = v;
      });

    }

    fetchDashboard() {
      this.dashboardService.fetchDashboard()
        .subscribe(res=>{
          if (res.errorCode != undefined && res.errorCode != 200) {                  
          } else {
            this.dashboard = res;
          }
        });
    }

    get f() { return this.dashboardForm.controls; }

  ngOnInit(): void {
  }
}
