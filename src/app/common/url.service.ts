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
}
