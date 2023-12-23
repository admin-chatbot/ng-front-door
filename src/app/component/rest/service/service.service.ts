import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { Application } from 'src/app/entity/application';
import {  HandleError, HttpErrorHandlerService } from '../../../http/http-error-handler.service'
import { Service } from 'src/app/entity/service';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {


  private handleError: HandleError;
  private token:any;
  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('ServiceService');
  }


  onBoard(service:Service) : Observable<string | any> {
    const url = this.url.service();     
    
    alert(JSON.stringify(service));
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':'sfsdfklksf-sfdfsf', 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<any>(url,service,httpOptions)
    .pipe(
      catchError(this.handleError('OnBoard Service'))
    )
  }

  fetchService() : Observable<Service[] | any>{
    const url = this.url.service()+'1/';   
    alert(url);
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<Service[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('serviceList'))
    );
  }
  

}
