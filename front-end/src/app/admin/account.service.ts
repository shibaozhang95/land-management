import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import {DatabaseService} from "./database.service"


export interface NewAdmin {
  username: string,
  password: string,
  user_type: number
}

export interface User {
  //_id: string,
  username: string,
  password: string,
  user_type: number
}

export interface QuollRes {
  code: number,
  data: any,
  errMsg: any
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})


export class AccountService {

  // adminsList: Admin[]

  constructor(private http: HttpClient) { }

  getAdminsList(): Observable<QuollRes> {
    
    let url = "http://localhost:3000/api/get_all_user"
    // let url = "http://localhost:3000/api/get_administrator_list"
    return this.http.get<QuollRes>(url)
  }

  deleteAdmin(id : string): Observable<QuollRes> {
    let url = "http://localhost:3000/api/delete_administrator"
    return this.http.post<QuollRes>(url, {_id: id}, httpOptions);
  }

  addAdmin(admin: NewAdmin): Observable<QuollRes> {
    let url = "http://localhost:3000/api/create_user"
    return this.http.post<QuollRes>(url, admin, httpOptions);
  }
}
