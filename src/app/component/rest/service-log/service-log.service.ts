import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { ServiceLog } from 'src/app/entity/serviceLog';
import { HandleError, HttpErrorHandlerService } from 'src/app/http/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceLogService {

  private handleError: HandleError;
  private token:any;
  private id:any;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) { 
      this.handleError = httpErrorHandler.createHandleError('ServiceService');
      this.token = localStorage.getItem('token');
      this.id = localStorage.getItem('id');
    }
  
  
  fetchService() : Observable<ServiceLog[] | any>{ 
    const url = this.url.serviceLog();       
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<ServiceLog[]>(url, httpOptions)
     .pipe(
        catchError(this.handleError('serviceList'))
      );
  }


    

}
