import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Dashboard } from 'src/app/entity/dashboard';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard = new Dashboard;
  constructor(private router: Router, private route: ActivatedRoute, 
    private messageService: MessageService,
    private dashboardService:DashboardService) {      
    
      this.fetchDashboard();

    }
  
  fetchDashboard() {
    this.dashboardService.fetchDashboard()
      .subscribe(res=>{
        alert("response code value")
        alert(res.errorCode)
        alert("applicationCount value")
        alert(this.dashboard.applicationCount)
        if (res.errorCode != undefined && res.errorCode != 200) {                  
        } else {
          this.dashboard = res;
        }
      });
  }  
  


  

  ngOnInit(): void {
    this.dashboardService.fetchDashboard()
  }

 

}

