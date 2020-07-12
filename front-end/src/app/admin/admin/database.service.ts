import { Injectable } from '@angular/core';
export interface User {
    firstName: string;
    id: string;
    lastName : string
  }
@Injectable({
  providedIn: 'root',
})


export class DatabaseService {
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
 
  add(user: User) {
    this.userList.push(user);
  }
 
  deleteRow(id){
    for(var i=0; i < this.userList.length; i++){

      if(this.userList[i]["id"] == id){
        this.userList.splice(i,1);
      }
    }
    
    // this.ref.detectChanges();
  }
}