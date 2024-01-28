import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Dashboard } from 'src/app/entity/dashboard';
import { ChartOptions,ChartEvent } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  dashboard: Dashboard = new Dashboard;
  constructor(private router: Router, private route: ActivatedRoute, 
    private messageService: MessageService,
    private dashboardService:DashboardService) { 
      this.fetchDashboard();  
       
  }

  public chartClicked(e: any): void {
    if (e.event.type == "click") {
      const clickedIndex = e.active[0]?.index;
      alert("Clicked index=" + clickedIndex);
    }
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

  ngOnInit(): void {
   
  }

 

}

