import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];
  shortMessage : string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  addShort(shortMessage: string){
    this.shortMessage.push(shortMessage);
  }

  getMostResentMessage():string {
    return this.shortMessage.pop()||'';
  }

  clear() {
    this.messages = [];
    this.shortMessage = [];
  }
}
