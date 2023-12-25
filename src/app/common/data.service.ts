import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sourceUrlSource = new BehaviorSubject<string>("");
  currentMessage = this.sourceUrlSource.asObservable();

  constructor() { }

  changeUrl(message: string) {
    this.sourceUrlSource.next(message)
  } 
}
