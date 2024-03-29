import { Component, Injectable, OnInit } from '@angular/core';
import { HandleError, HttpErrorHandlerService } from 'src/app/http/http-error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from 'src/app/common/url.service';
import { Application } from 'src/app/entity/application';
import { Observable, catchError, tap } from 'rxjs';
import { ApplicationCount } from 'src/app/entity/applicationcount';
import { ClientDetail } from 'src/app/entity/clientDetail';



@Injectable({
  providedIn: 'root'
})
export class ClientDetailService implements OnInit {
  applications: Application[] = [];
  totalApplications: number = 0;
  clientDetails:ClientDetail[] = [];
  private token:any;
  private handleError!: HandleError;
  clientId:any;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.clientId=localStorage.getItem('id'); 
     
    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  

    fetchTotalApplications() : Observable<Application[] | any>{
      const url = this.url.application();   
      const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':'fsf', 'Content-Type': 'application/json','accept':'application/json' }) };
      return this.http.get<Application[]>(url, httpOptions)
     
    }

    fetchClientDetails() : Observable<ClientDetail | any>{
      const url = this.url.client() + this.clientId + '/';
      const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':'fsf', 'Content-Type': 'application/json','accept':'application/json' }) };
      return this.http.get<ClientDetail>(url, httpOptions);
    }
 
  
}
export { ClientDetail};

