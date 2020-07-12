import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface QuollRes {
  code: number,
  data: any,
  errMsg: any
}

export interface User {
  //_id: string,
  username: string,
  password: string,
  user_type: number
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})


export class SignUpService {

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<QuollRes> {
    let url = "http://localhost:3000/api/create_user"
    return this.http.post<QuollRes>(url, user, httpOptions);
  }
}

