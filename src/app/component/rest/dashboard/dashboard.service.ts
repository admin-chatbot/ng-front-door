import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { UrlService } from 'src/app/common/url.service'; 
import {  HandleError, HttpErrorHandlerService } from '../../../http/http-error-handler.service'
import { Dashboard } from 'src/app/entity/dashboard';
import { DashboardSearch } from 'src/app/entity/dashboardsearch';
import { ServiceLog } from 'src/app/entity/serviceLog';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private handleError: HandleError;
  private token:any;  

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('DashboardService');
      this.token = localStorage.getItem('token');
  }

  fetchDashboard(dashboardSearch: DashboardSearch) : Observable<Dashboard | any>{  
    const url = this.url.dashboard() + "search";     

    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token,'accept':'application/json' }) };    
    return this.http.post<Dashboard>(url, dashboardSearch, httpOptions).pipe(
      tap(data => { 
        console.log('Data received: ' + JSON.stringify(data));
      }),
      catchError((error) => { 
        return this.handleError('Error fetching dashboard data')(error);
      })
    );
  }

  fetchServiceLogs(dashboardSearch: DashboardSearch) : Observable<ServiceLog | any>{  
    const url = this.url.dashboard() + "search/servicelog/";    

    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token,'accept':'application/json' }) };    
    return this.http.post<Dashboard>(url, dashboardSearch, httpOptions).pipe(
      tap(data => { 
        //console.log('Data received: ' + JSON.stringify(data));
      }),
      catchError((error) => { 
        return this.handleError('Error fetching dashboard data')(error);
      })
    );
  }
}