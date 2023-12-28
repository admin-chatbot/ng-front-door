import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { Application } from 'src/app/entity/application';
import {  HandleError, HttpErrorHandlerService } from '../../../http/http-error-handler.service'
import { Dashboard } from 'src/app/entity/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private handleError: HandleError;
  private token:any;  

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('ServiceService');
  }

  fetchDashboard() : Observable<Dashboard | any>{
    alert("Test service call")
    const url = this.url.dashboard(); 
     
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    alert(url);
    return this.http.get<Dashboard>(url, httpOptions)
    .pipe(
      catchError(this.handleError('dashboard'))
    );
  }
   

}
