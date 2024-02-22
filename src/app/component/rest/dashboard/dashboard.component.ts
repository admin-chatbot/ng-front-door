import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/http/message.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/entity/service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Dashboard } from 'src/app/entity/dashboard';
import { ChartOptions,ChartEvent,ChartData,ChartType,ChartConfiguration } from 'chart.js';
import { DashboardSearch } from 'src/app/entity/dashboardsearch'; 
import { BaseChartDirective } from 'ng2-charts'; 
import { ServiceLog } from 'src/app/entity/serviceLog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ServiceLogs } from 'src/app/entity/serviceLogs';
import { DashboardChartService } from './dashboard-chart.service'; 
import {
  ActiveElement,
  Chart
} from 'chart.js';

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


  public chartOptions: ChartConfiguration['options'] = {
    responsive: true, 
    onHover: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      chart.canvas.style.cursor= elements.length !==0 ? 'pointer' : 'default';
    },
    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      if (elements[0]) {
        console.log('Clicked on ', this.barChartData.labels![elements[0].index]);
      }
    },
  };


  public barChartData: ChartData<'bar'> = {
    labels: [],
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
	}	 
  
   
   

  statusClicked(e: any) {    
    if (e.event.type == "click") {
      const clickedIndex = e.active[0]?.index;
      console.log("Clicked index=" + JSON.stringify( this.pieChartLabels[clickedIndex]));
    }  
  }

  applicationClicked(e:any) {
    if (e.event.type == "click") {
      const clickedIndex = e.active[0]?.index;
      console.log("Clicked index=" + JSON.stringify( this.pieChartLabels1[clickedIndex]));
    } 
  }

  serviceCliecked(e:any) {
    if (e.event.type == "click") {
      const clickedIndex = e.active[0]?.index;
      console.log("Clicked index=" + JSON.stringify( this.pieChartLabels2[clickedIndex]));
    } 
  } 

  fetchDashboard( ) {
    this.dashboardService.fetchDashboard(this.dashboardSearch)
      .subscribe(res=>{         
        if (res.errorCode != undefined && res.errorCode != 200) {              
        } else {
          if (res) { 
            this.logs = res.data;  
            this.chartService.setLogs(res.data);
            this.daily(this.logs);
          } else { 
            console.error('Response is undefined or null');
          }
        }
      });
  } 


  daily(res:any) { 
    this.pieChartLabels = ["SUCCESS","FAIL"];
    this.pieChartDatasets[0].data = this.chartService.getTotalDailyData();

    var aplicationData = this.chartService.getApplicationDailyData();
            
    this.pieChartLabels1 = aplicationData[0];
    this.pieChartDatasets1[0].data = aplicationData[1];

    var serviceData = this.chartService.getServiceDailyData();             

    this.pieChartLabels2 = serviceData[0];
    this.pieChartDatasets2[0].data = serviceData[1];

           
    var dailyBarData = this.chartService.get24HorsBarChart() 
    this.barChartData.labels = ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12', '13', '14','15', '16', '17', '18', '19','20','21', '22','23']
    this.barChartData.datasets[0].data = dailyBarData[0];
    this.barChartData.datasets[1].data = dailyBarData[1] 
    this.chart?.update();

  }

  weekly(res:any) { 
    this.pieChartLabels = ["SUCCESS","FAIL"];
    this.pieChartDatasets[0].data = this.chartService.getTotalWeeklyData();

    var aplicationData = this.chartService.getApplicationWeeklyData();
            
    this.pieChartLabels1 = aplicationData[0];
    this.pieChartDatasets1[0].data = aplicationData[1];

    var serviceData = this.chartService.getServiceDailyData();             

    this.pieChartLabels2 = serviceData[0];
    this.pieChartDatasets2[0].data = serviceData[1];

           
    var weeklyBarData = this.chartService.getWeeklyBarChart() ;
    alert(weeklyBarData[0]);
    this.barChartData.labels = weeklyBarData[0];
    this.barChartData.datasets[0].data = weeklyBarData[1];
    this.barChartData.datasets[1].data = weeklyBarData[2];
    this.chart?.update();

  }

  monthy(res:any) { 
    this.pieChartLabels = ["SUCCESS","FAIL"];
    this.pieChartDatasets[0].data = this.chartService.getTotalMonthlyData()

    var aplicationData = this.chartService.getApplicationMonthlyData()
            
    this.pieChartLabels1 = aplicationData[0];
    this.pieChartDatasets1[0].data = aplicationData[1];

    var serviceData = this.chartService.getServiceMonthlyData();             

    this.pieChartLabels2 = serviceData[0];
    this.pieChartDatasets2[0].data = serviceData[1];

           
    var monthlyBarData = this.chartService.getMonthlyBarChart();
    alert(monthlyBarData[0]);
    this.barChartData.labels = monthlyBarData[0]
    this.barChartData.datasets[0].data = monthlyBarData[1];
    this.barChartData.datasets[1].data = monthlyBarData[2] 
    this.chart?.update();

  }
  
   

  selectTimeFrame(timeFrame: string, event: Event) {
    event.preventDefault();
     
    if (timeFrame === 'Daily') {
      this.daily(this.logs);
    } else if (timeFrame === 'Last Week') {
      this.weekly(this.logs);
    } else if (timeFrame === 'Last Month') {
      this.monthy(this.logs);
    }   
   
  }

   ngOnInit() {
    this.fetchDashboard();
  }

}


