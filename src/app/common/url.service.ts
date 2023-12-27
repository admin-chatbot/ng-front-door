import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }

  public application():string {
    return environment.baseEndpoint + "application/";
  }

  public login():string {
    return environment.baseEndpoint + "auth/login/";
  }

  public serviceDiscover():string {
    return environment.baseEndpoint + "service/discover/";
  }
  public serviceLoad():string {
    return environment.baseEndpoint + "service/load/";
  }
}
