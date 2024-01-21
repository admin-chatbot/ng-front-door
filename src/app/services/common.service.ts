import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

   stringFilterOperations = [
      {'key':'EQUAL','value':'eq'},
      {'key':'NOT EQUAL','value':'neg'},
      {'key':'LIKE','value':'like'}, 
      {'key':'START WITH','value':'slike'},
      {'key':'END WITH','value':'elike'},
    ]

    numberFilterOperations = [
      {'key':'EQUAL','value':'eq'},
      {'key':'NOT EQUAL','value':'neg'},
      {'key':'GREATER THAN','value':'gt'}, 
      {'key':'GREATER THAN EQUAL','value':'gte'},
      {'key':'LESS THAN','value':'lt'},
      {'key':'LESS THAN OR EQUAL','value':'lte'}, 
      {'key':'IN','value':'in'},
      {'key':'NOT IN','value':'nin'},
    ]

    status: string[] = ['NEW', 'REVIEW', 'ACTIVE','HOLD', 'INACTIVE']; 

  constructor() { }


}
