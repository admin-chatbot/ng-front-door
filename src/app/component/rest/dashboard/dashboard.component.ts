import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Dashboard } from 'src/app/entity/dashboard';
import { ChartOptions,ChartEvent,ChartData,ChartType,ChartConfiguration } from 'chart.js';
import { DashboardSearch } from 'src/app/entity/dashboardsearch'; 
import { BaseChartDirective } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ServiceLog } from 'src/app/entity/serviceLog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ServiceLogs } from 'src/app/entity/serviceLogs';
import { DashboardChartService } from './dashboard-chart.service'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['serviceEndpoint', 'serviceName', 'response',"status","logDate"];
  dataSource = new MatTableDataSource<ServiceLog>();
 

  @ViewChild(BaseChartDirective , { static: true }) chart: BaseChartDirective | undefined;
 
  selectedStatus: string = '';
  selectedApplication: number = 0;
 

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels: string[] = []; // Updated to empty array
  public pieChartDatasets: { data: number[] }[] = [{ data: [] }]; // Explicit typing
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartLabels1: string[] = []; // Updated to empty array
  public pieChartDatasets1: { data: number[] }[] = [{ data: [] }]; // Explicit typing

  public pieChartLabels2: string[] = []; // Updated to empty array
  public pieChartDatasets2: { data: number[] }[] = [{ data: [] }]; // Explicit typing

  public labels : any;
  public datasets: any;

  public barChartOptions: ChartConfiguration['options'] = { 
    responsive: true,
  };
  public barChartPlugins = [];

  public barChartType: ChartType = 'bar'; 

  public barChartData: ChartData<'bar'> = {
    labels: ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12', '13', '14','15', '16', '17', '18', '19','20','21', '22','23'],
    datasets: [
      { data: [], label: 'Success' },
      { data: [], label: 'Fail' },
    ],    
  };

 


  dashboardSearch: DashboardSearch = {} as DashboardSearch;  
  clientId:any;
  serviceLogs: ServiceLog[] = [];
  
  logs:ServiceLogs = {} as ServiceLogs;

  dashboard: Dashboard = new Dashboard;
  constructor(private router: Router, private route: ActivatedRoute, 
    private messageService: MessageService,
 
    private dashboardService:DashboardService,
    private chartService:DashboardChartService) { 
      this.clientId=localStorage.getItem('id');  
      this.dashboardSearch.clientId = this.clientId;  
      this.dashboardSearch.clientId = this.clientId;
      this.dashboardSearch.serviceUserOption = "SERVICE";
      this.dashboardSearch.timeFrame = "currentDay";             
  

  chartClickedStatus(event: any) {
    if (event.event.type == "click") {
      const clickedIndex = event.active[0]?.index;
      const statusClicked = this.pieChartLabels[clickedIndex]; 
      this.selectedStatus = statusClicked;
      this.dashboardSearch.status = statusClicked;
 
      
      console.log(this.selectedStatus);
 
      this.fetchDashboard( this.dashboardSearch);
    }
    
  }

  chartClickedApplication(event: any) {
    if (event.event.type == "click") {
      
      if (this.selectedStatus) {
        this.dashboardSearch.status = this.selectedStatus;
      }

      const clickedIndex = event.active[0]?.index;
      console.log(clickedIndex);
      console.log(this.pieChartLabels1[clickedIndex]);

      const applicationClicked = parseInt(this.pieChartLabels1[clickedIndex]); 
      this.selectedApplication = applicationClicked;
      this.dashboardSearch.application = applicationClicked;

      console.log(this.selectedStatus);
      console.log(this.selectedApplication);

      this.fetchDashboard( this.dashboardSearch);
    }
    
  }
  
  chartClickedServiceOrUser(event: any) {
    if (event.event.type == "click") {
      const clickedIndex = event.active[0]?.index;
      
      const applicationClicked = this.pieChartLabels2[clickedIndex]; 
      
      
      this.dashboardSearch.application = Number(applicationClicked);
      console.log("Service or User selected");
      console.log(this.dashboardSearch.application);      
      
      this.fetchDashboard( this.dashboardSearch);
    }
    
  }

  chartClickedBar(event: any) {
    if (event.event.type == "click") { 
      const clickedIndex = event.active[0]?.index;      
      const statusClicked = this.pieChartLabels[clickedIndex];  
      this.dashboardSearch.status = statusClicked;   
      const clickedIndex = event.active[0]?.index;      
      const applicationClicked = this.pieChartLabels[clickedIndex];       
      
      this.dashboardSearch.application = Number(applicationClicked);     
 
      this.fetchDashboard( this.dashboardSearch);
    }
    
  }


  fetchDashboard(dashboardSearch: DashboardSearch) {
    this.dashboardService.fetchDashboard(dashboardSearch)
      .subscribe(res=>{         
        if (res.errorCode != undefined && res.errorCode != 200) {              
        } else {
          if (res) { 
            this.logs = res.data;   
            this.chartService.setLogs(res.data); 
            this.pieChartLabels = ["SUCCESS","FAIL"];
            this.pieChartDatasets[0].data = this.chartService.getTotalDailyData();

           

            var aplicationData = this.chartService.getApplicationDailyData();
            
            this.pieChartLabels1 = aplicationData[0];
            this.pieChartDatasets1[0].data = aplicationData[1];

            var serviceData = this.chartService.getServiceDailyData();

            this.pieChartLabels2 = serviceData[0];
            this.pieChartDatasets2[0].data = serviceData[1];

           
            var dailyBarData = this.chartService.get24HorsBarChart() 
            this.barChartData.datasets[0].data = dailyBarData[0];
            this.barChartData.datasets[1].data = dailyBarData[1] 
            this.chart?.update(); 
            

          } else {
            // Handle case where res is undefined or null
            console.error('Response is undefined or null');
          }
        }
      });
  }  

  selectTimeFrame(timeFrame: string, event: Event) {
    event.preventDefault();
     
    if (timeFrame === 'Daily') {
      this.dashboardSearch.timeFrame = 'currentDay';
    } else if (timeFrame === 'Last Week') {
      this.dashboardSearch.timeFrame = 'lastWeek';
    } else if (timeFrame === 'Last Month') {
      this.dashboardSearch.timeFrame = 'lastMonth';
    }
    
   
  }

   

   ngOnInit() {
    setTimeout(() => {
      this.fetchDashboard(this.dashboardSearch); 
    
    }, 3000);
    // this.chart.update();
  }


}

