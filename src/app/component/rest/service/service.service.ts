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
  private id:any;
  
  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('ServiceService');
      this.token=localStorage.getItem('token');
      this.id=localStorage.getItem('id');
  }


  onBoard(service:Service) : Observable<string | any> {
    const url = this.url.service();       
 
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<any>(url,service,httpOptions)
    .pipe(
      catchError(this.handleError('OnBoard Service'))
    )
  }

  fetchService() : Observable<Service[] | any>{ 
    const url = this.url.service()+this.id+'/';       
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<Service[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('serviceList'))
    );
  }


  editService(service:Service) : Observable<string | any> {
    const url = this.url.service();     
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.put<any>(url,service,httpOptions)
    .pipe(
      catchError(this.handleError('Edit Service'))
    )
  }
  
  fetchApplicationNames(clientId: string): Observable<string[] | any> {
    const url = this.url.application() + clientId +'/' ; // Adjust the API endpoint accordingly
  
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER': this.token,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      })
    };
  
    return this.http.get<string[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError('Fetch Application Names'))
      );
  }

}
