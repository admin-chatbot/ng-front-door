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


  public signup():string {
    return environment.baseEndpoint + "auth/register/";
  }

  public service():string {
    return environment.baseEndpoint + "service/";
  }

  public serviceParametrer():string {
    return environment.baseEndpoint + "service/parameter/";
  }

  public dashboard():string {
    return environment.baseEndpoint + "dashboard/";
  }

  public serviceDiscover():string {
    return environment.baseEndpoint + "service/discover/";
  }
  public serviceLoad():string {
    return environment.baseEndpoint + "service/load/";
  }

}
