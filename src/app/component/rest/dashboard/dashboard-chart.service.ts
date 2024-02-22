import { Injectable } from '@angular/core';
import { ServiceLogs } from 'src/app/entity/serviceLogs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardChartService {

  constructor() { }

  logs:ServiceLogs = {} as ServiceLogs;

  public getSuccessFailData():number[] | any {

  } 

  setLogs(serviceLogs:ServiceLogs) {
    this.logs = serviceLogs;
  }


  get24HorsBarChart():[number[],number[]] {
    var success : number[] = []; 
    var fail: number[] = []; 

    for(var i=1;i<24;i++){
      var daily = this.logs.Daily.find(d=>d.hour===i+"");
      if(daily) {
        success.push(daily.success);
        fail.push(daily.fail)
      }else {
        success.push(0);
        fail.push(0)
      }
    } 
    return [success,fail];
  }

  getWeeklyBarChart():[string[],number[],number[]] {
     
    var success : number[] = []; 
    var fail: number[] = []; 
    var label: string[] = [];


    for(var i=6;i>=0;i--){ 
     const dayOfWeek =  moment().subtract(i,'d').format('YYYYMMDD');
     console.log(dayOfWeek);
     label.push(dayOfWeek);
      var day = this.logs.Weekly.find(d=>d.day===dayOfWeek);
      if(day) {
        success.push(day.success);
        fail.push(day.fail)
      }else {
        success.push(0);
        fail.push(0)
      }
    }  
    return [label,success,fail];
  }

  getMonthlyBarChart():[String[],number[],number[]] {
    var success : number[] = []; 
    var fail: number[] = []; 
    var label : string [] = [];
    for(var i=30;i>=0;i--){
     const dayOfMonth =  moment().subtract(i,'d').format('YYYYMMDD');
     label.push(dayOfMonth)
      var date = this.logs.Monthly.find(d=>d.date===dayOfMonth);
      if(date) {
        success.push(date.success);
        fail.push(date.fail)
      }else {
        success.push(0);
        fail.push(0)
      }
    } 
    return [label,success,fail];
  }




  getTotalDailyData():  number[] { 
    var totalSuccess = 0;
    var totalFail = 0
    this.logs.Daily.forEach(element => {
       element.data.forEach(element => {        
         totalSuccess = totalSuccess + element.success
         totalFail = totalFail + element.fail; 
       });
    });

    return [totalSuccess,totalFail];
  }

  getTotalWeeklyData():  number[] { 
    var totalSuccess = 0;
    var totalFail = 0
    this.logs.Weekly.forEach(element => {
       element.data.forEach(element => {        
         totalSuccess = totalSuccess + element.success
         totalFail = totalFail + element.fail; 
       });
    });

    return [totalSuccess,totalFail];
  }

  getTotalMonthlyData():  number[] { 
    var totalSuccess = 0;
    var totalFail = 0
    this.logs.Monthly.forEach(element => {
       element.data.forEach(element => {        
         totalSuccess = totalSuccess + element.success
         totalFail = totalFail + element.fail; 
       });
    });

    return [totalSuccess,totalFail];
  }


  getApplicationDailyData(): [string[],number[]] {
    var label : string[] = []; 
    var value: number[] = [];
    let lableValue = new Map<string, number>();

    this.logs.Daily.forEach(element => {
       element.data.forEach(element => {        
        const total = element.success+ element.fail;
        const appName = element.application;
        if(lableValue.has(appName)){
           lableValue.set(appName, lableValue.get(appName)!+total)
        }else {
          lableValue.set(appName, total)
        }
         
       });
    });

    for (let entry of lableValue.entries()) {  
      label.push(entry[0])
      value.push(entry[1]);   
  }  

    return [label,value];
  }

  getApplicationWeeklyData(): [string[],number[]] {
    var label : string[] = []; 
    var value: number[] = [];
    let lableValue = new Map<string, number>();

    this.logs.Weekly.forEach(element => {
       element.data.forEach(element => {        
        const total = element.success+ element.fail;
        const appName = element.application;
        if(lableValue.has(appName)){
           lableValue.set(appName, lableValue.get(appName)!+total)
        }else {
          lableValue.set(appName, total)
        }
         
       });
    });

    for (let entry of lableValue.entries()) {  
      label.push(entry[0])
      value.push(entry[1]);   
  }  

    return [label,value];
  }

  getApplicationMonthlyData(): [string[],number[]] {
    var label : string[] = []; 
    var value: number[] = [];
    let lableValue = new Map<string, number>();

    this.logs.Monthly.forEach(element => {
       element.data.forEach(element => {        
        const total = element.success+ element.fail;
        const appName = element.application;
        if(lableValue.has(appName)){
           lableValue.set(appName, lableValue.get(appName)!+total)
        }else {
          lableValue.set(appName, total)
        }
         
       });
    });

    for (let entry of lableValue.entries()) {  
      label.push(entry[0])
      value.push(entry[1]);   
  }  

    return [label,value];
  }

  getServiceDailyData(): [string[],number[]] {
    var label : string[] = []; 
    var value: number[] = [];
    let lableValue = new Map<string, number>();

    this.logs.Daily.forEach(element => {
       element.data.forEach(element => {        
        element.data. forEach(element => {
          const total = element.logs.SUCCESS+ element.logs.FAIL;
          const serviceName = element.service;
          if(lableValue.has(serviceName)){
            lableValue.set(serviceName, lableValue.get(serviceName)!+total)
          }else {
            lableValue.set(serviceName, total)
          }
        });         
       });
    });

    for (let entry of lableValue.entries()) {  
      label.push(entry[0])
      value.push(entry[1]);   
    }  

    return [label,value];
  }

  getServiceWeeklyData(): [string[],number[]] {
    var label : string[] = []; 
    var value: number[] = [];
    let lableValue = new Map<string, number>();

    this.logs.Weekly.forEach(element => {
       element.data.forEach(element => {        
        element.data. forEach(element => {
          const total = element.logs.SUCCESS+ element.logs.FAIL;
          const serviceName = element.service;
          if(lableValue.has(serviceName)){
            lableValue.set(serviceName, lableValue.get(serviceName)!+total)
          }else {
            lableValue.set(serviceName, total)
          }
        });         
       });
    });

    for (let entry of lableValue.entries()) {  
      label.push(entry[0])
      value.push(entry[1]);   
    }  

    return [label,value];
  }


  getServiceMonthlyData(): [string[],number[]] {
    var label : string[] = []; 
    var value: number[] = [];
    let lableValue = new Map<string, number>();

    this.logs.Monthly.forEach(element => {
       element.data.forEach(element => {        
        element.data. forEach(element => {
          const total = element.logs.SUCCESS+ element.logs.FAIL;
          const serviceName = element.service;
          if(lableValue.has(serviceName)){
            lableValue.set(serviceName, lableValue.get(serviceName)!+total)
          }else {
            lableValue.set(serviceName, total)
          }
        });         
       });
    });

    for (let entry of lableValue.entries()) {  
      label.push(entry[0])
      value.push(entry[1]);   
    }  

    return [label,value];
  }
}
