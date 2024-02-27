import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { HandleError, HttpErrorHandlerService } from '../../../http/http-error-handler.service';
import { BotLogDetails } from 'src/app/entity/botlogdetail';
import { SelectedLogDetails } from 'src/app/entity/selectedLog';

@Injectable({
  providedIn: 'root'
})
export class BotLogService {
  private handleError: HandleError;
  private token: any;
  private id: any;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService, private url: UrlService) {
    this.handleError = httpErrorHandler.createHandleError('ServiceService');
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('id');
  }

  fetchBotLogRequests(name: string): Observable<BotLogDetails[] | any> {   
    const url = this.url.botLog() + name + '/';
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER': this.token, 'Content-Type': 'application/json', 'accept': 'application/json' }) };
    //alert(url);
    return this.http.get<BotLogDetails[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError('botLogDetailList'))
      );
  }

  fetchResponse(requestId: string): Observable<BotLogDetails[] | any> {
    //const url = 'http://localhost:9090/api/v1/botrequestlog/request/1';
    const url = this.url.botLog() + 'request/' + requestId;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER': this.token,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      })
    };
    return this.http.get<BotLogDetails>(url, httpOptions)
      .pipe(
        catchError(this.handleError('fetchResponse'))
      );
  }
}
