import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
//import {DatabaseService} from "./database.service"
export interface User {
    firstName: string;
    id: string; 
    lastName : string
  }
@Injectable({
  providedIn: 'root',
})


export class AccountService {

    userList = [
        {id: '1', firstName: 'Taylor', lastName: 'Swift'},
        {id: '2', firstName: 'Janifer', lastName : 'Larrence'},
        {id: '3', firstName: 'Harry', lastName : 'Potter'},
        {id: '4', firstName: 'Katy', lastName : 'Perry'},
        {id: '5', firstName: 'Steve', lastName : 'Jobs'},
        {id: '6', firstName: 'Bobby', lastName : 'Zhang'},
        {id: '7', firstName: 'Juntao', lastName : 'Wu'},
        {id: '8', firstName: 'Serena', lastName : 'Williams'}
    ];
 
    constructor() { }

    getUser(): Observable<User[]> {
        // TODO: send the message _after_ fetching the heroes
        return of(this.userList);
      }
}