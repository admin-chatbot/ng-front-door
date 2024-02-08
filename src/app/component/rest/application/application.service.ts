import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { Application } from 'src/app/entity/application';
import {  HandleError, HttpErrorHandlerService } from '../../../http/http-error-handler.service'
import { ApplicationSearch } from 'src/app/entity/applicationSearch';
import { ApiResponce } from 'src/app/entity/apiResponce';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {


  private handleError: HandleError;
  private token:any;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.token = localStorage.getItem('token'); 
      this.handleError = httpErrorHandler.createHandleError('ApplicationService');
  }


  onBoard(application:Application) : Observable<string | any> {
    const url = this.url.application();       
    application.id=0;     
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<any>(url,application,httpOptions)
    .pipe(
      catchError(this.handleError('OnBoard Application'))
    )
  }

  edit(application:Application) : Observable<string | any> {
    const url = this.url.application();       
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.put<any>(url,application,httpOptions)
    .pipe(
      catchError(this.handleError('OnBoard Application'))
    )
  }

  fetchApplication() : Observable<Application[] | any>{
    const url = this.url.application();   
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
   
    return this.http.get<Application[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('applicationList'))
    );
  }

  fetchApplicationByClientAndStatus(id:number,status:string) : Observable<Application[] | any>{
      const url = this.url.application()+"byClient/"+id+"/status/"+status;   
      const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
      
      return this.http.get<Application[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError('applicationList'))
      );
  }

  search(applicationSearchRequest:ApplicationSearch) :Observable<ApiResponce | any> {
    const url = this.url.application()+"search/";   
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<ApiResponce>(url,applicationSearchRequest,httpOptions)
    .pipe(
      catchError(this.handleError('Search'))
    );
  }


  

}
