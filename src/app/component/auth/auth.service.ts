import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { Login } from 'src/app/entity/login';
import { HandleError, HttpErrorHandlerService } from 'src/app/http/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private handleError: HandleError;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('AuthService');
  }


  login(login:Login) : Observable<string | any> {
    const url = this.url.login(); 
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<any>(url,login,httpOptions)
    .pipe(
      catchError(this.handleError('Login'))
    )
  }

 
}
