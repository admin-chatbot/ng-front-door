import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UrlService } from 'src/app/common/url.service';
import { ApiResponce } from 'src/app/entity/apiResponce';
import { User } from 'src/app/entity/user';
import { UserSearch } from 'src/app/entity/userSearch';
import { HandleError, HttpErrorHandlerService } from 'src/app/http/http-error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  fetchApplicationNames(clientId: any) {
    throw new Error('Method not implemented.');
  }

  private handleError: HandleError;
  private token:any;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.token = localStorage.getItem('token'); 
      this.handleError = httpErrorHandler.createHandleError('UserService ');
    }

  register(user:User):Observable<User|any>{
    const url = this.url.user();    
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.post<any>(url,user,httpOptions)
    .pipe(
      catchError(this.handleError('Register User'))
    )
  }




  edit(user:User):Observable<User|any>{
    alert(JSON.stringify(user));
    const url = this.url.user();    
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.put<any>(url,user,httpOptions)
    .pipe(
      catchError(this.handleError('Edit User.'))
    )
  }


  list():Observable<User[]|any> {
    const url = this.url.user();   
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<User[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('list users.'))
    );
  }

  byClientId(id:number):Observable<User[]|any> {
    const url = this.url.user()+id+"/"; 
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<User[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('list users.'))
    );
  }

  
  fetchUserByClientAndStatus(id:number,status:string) : Observable<User[] | any>{
    const url = this.url.user()+"byClient/"+id+"/status/"+status;   
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
    return this.http.get<User[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('userList'))
    );
}



search(userSearchRequest:UserSearch) :Observable<ApiResponce | any> {
  const url = this.url.user()+"search/";   
  const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER':this.token, 'Content-Type': 'application/json','accept':'application/json' }) };
  return this.http.post<ApiResponce>(url,userSearchRequest,httpOptions)
  .pipe(
    catchError(this.handleError('Search'))
  );
}
fetchApplicationNames1(clientId: string): Observable<string[] | any> {
  const url = this.url.application() + clientId + '/'; // Adjust the API endpoint accordingly

  const httpOptions = {
    headers: new HttpHeaders({
      'X-AUTH-LOG-HEADER': this.token,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    })
  };

  // Return the observable from the HTTP request
  return this.http.get<string[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError('Fetch Application Names'))
    );
}
}
