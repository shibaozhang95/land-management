import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LocalStorage } from '@ngx-pwa/local-storage';

const RootUrl = 'http://localhost:3000/api/users'
const API = {
  'Login': RootUrl + '/login',
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

export interface QuollResponse {
  code: number,
  data: any,
  errMsg: any
}

export interface User {
  username: string,
  password: string,
  user_type: number,
  _id: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: User
  
  constructor(
    private http: HttpClient,
    protected localStorage: LocalStorage
  ) { }

  storeUserInfoLocally(): void {

  }

  getUserInfoLocally(): any {
    return new Promise((resolve, reject) => {
      this.localStorage.getItem('AB_Quoll')
      .subscribe((data) => {
        console.log(data)
        
        if (data) {
          this.currentUser = data
          resolve({ code: 0, data: data })
        }
        else resolve({ code: -1 })
      })
    })
  }
    
  logOut(): any {
    return new Promise((resolve, reject) => {
      this.localStorage.removeItem('AB_Quoll')
      .subscribe(res => {
        console.log(res);
        
        resolve({ code: 0 })
      })
    })
  }

  login(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.Login, {
      'username': param.username,
      'password': param.password
    }, httpOptions)
    .pipe(
      tap(
        data => {
          console.log(data)
          if (data.code == 0) {
            this.currentUser = data.data;
            console.log(this.currentUser)
            this.localStorage.setItem('AB_Quoll', this.currentUser)
            .subscribe(() => {
              console.log('Store user information to local successfully!')
            })
          }
        }
      )
    )
  }
}
