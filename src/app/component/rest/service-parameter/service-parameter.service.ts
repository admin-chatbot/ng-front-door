import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from 'src/app/common/url.service';
import {  HandleError, HttpErrorHandlerService } from '../../../http/http-error-handler.service'
import { Observable, catchError } from 'rxjs';
import { ServiceParameter } from 'src/app/entity/serviceParameters';
@Injectable({
  providedIn: 'root'
})
export class ServiceParameterService {
  private handleError: HandleError;
  private token:any;
  private id:any;
  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('ServiceParameter');
      this.token=localStorage.getItem('token');
      this.id=localStorage.getItem('id');
  }


  onBoard(serviceParameter:ServiceParameter) : Observable<string | any> {
    const url = this.url.service();     
    
 
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':'sfsdfklksf-sfdfsf', 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<any>(url,serviceParameter,httpOptions)
    .pipe(
      catchError(this.handleError('OnBoard Service'))
    )
  }

  fetchServiceParameter() : Observable<ServiceParameter[] | any>{
    //const url = this.url.service()+'1/'; 

    //const url = this.url.serviceParametrer()+this.id+'/';   
    const url = this.url.serviceParametrer()+18+'/';   
        alert("service parameter url" + url);   
    
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<ServiceParameter[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('serviceParameterList'))
    );
  }


  


 
  

}
export { ServiceParameter };

