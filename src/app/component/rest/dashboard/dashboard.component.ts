import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['serviceEndpoint', 'serviceName', 'response',"status","logDate"];
  dataSource = new MatTableDataSource<ServiceLog>();
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

  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartType: ChartType = 'bar';
  //public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    ],
  };


  dashboardSearch: DashboardSearch = {} as DashboardSearch;  
  clientId:any;
  serviceLogs: ServiceLog[] = [];

  dashboard: Dashboard = new Dashboard;
  constructor(private router: Router, private route: ActivatedRoute, 
    private messageService: MessageService,
    private dashboardService:DashboardService) { 
      this.clientId=localStorage.getItem('id'); 
      this.dashboardSearch.status = "ALL";
      this.dashboardSearch.clientId = this.clientId;
      this.dashboardSearch.serviceUserOption = "SERVICE";
      this.dashboardSearch.timeFrame = "currentDay";             
  }

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
            this.dashboard = res.data;
            this.dataSource.data = res.data.serviceLogs;
            //alert(JSON.stringify(res));

            
            //alert(JSON.stringify(this.dashboard));
            //alert(JSON.stringify(this.serviceLogs));
            console.log("before displaying on UI");
            console.log(JSON.stringify(this.dataSource.data));  
            const keys = Object.keys(this.dashboard.serviceCallsByStatus);
            const values = Object.values(this.dashboard.serviceCallsByStatus);
            const keys1 = Object.keys(this.dashboard.serviceCallsByApplication);
            const values1 = Object.values(this.dashboard.serviceCallsByApplication);
            const keys2 = Object.keys(this.dashboard.serviceCallsByServiceOrUser);
            const values2 = Object.values(this.dashboard.serviceCallsByServiceOrUser);

            
            // Assign keys to pieChartLabels
            this.pieChartLabels = keys;
            this.pieChartLabels1 = keys1;
            this.pieChartLabels2 = keys2;
      
            // Assign values to pieChartDatasets
            this.pieChartDatasets[0].data = values;
            this.pieChartDatasets1[0].data = values1;
            this.pieChartDatasets2[0].data = values2;

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
    
    this.fetchDashboard(this.dashboardSearch);
  }

  ngOnInit(): void {
    this.fetchDashboard(this.dashboardSearch);  
  }


}

