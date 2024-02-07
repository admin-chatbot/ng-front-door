import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { ApiResponce } from 'src/app/entity/apiResponce';
import { AutoDiscoverServiceRequest } from 'src/app/entity/autoDiscoverServiceRequest';
import { Service } from 'src/app/entity/service';
import { HandleError, HttpErrorHandlerService } from 'src/app/http/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AutoDIscoverService {

  private handleError: HandleError;
  private token:any;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.token = localStorage.getItem('token'); 
      this.handleError = httpErrorHandler.createHandleError('ApplicationService');
  }

  loadService(autoDiscoverServiceRequest:AutoDiscoverServiceRequest) :  Observable<ApiResponce |any>{
    const url = this.url.serviceLoad();    
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<ApiResponce>(url,autoDiscoverServiceRequest, httpOptions)
    .pipe(
      catchError(this.handleError('loadService'))
    );
  }


  discoverService(serviceDocsUrl:number) : Observable<Service[] |any> {
    const url = this.url.serviceDiscover()+serviceDocsUrl+"/";     
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<Service[]>(url,"", httpOptions)
    .pipe(
      catchError(this.handleError('discoverService'))
    );
  }

}
