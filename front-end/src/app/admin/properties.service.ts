import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PeriodicElement } from './periodicElement';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface QuollRes {
  code: number,
  data: any,
  errMsg: any
}
export interface RequiredLandInfo {
  //_id: string,
  agreement_type: number,
  plot_id: string,
  address: string,
  owner: string,
  coordinates: any
}


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  addressResults = []

  
  constructor(private http: HttpClient) { }
  
  getLandList(): Observable<QuollRes> {
    let url = "http://localhost:3000/api/get_all_native_titles"
    return this.http.get<QuollRes>(url);
  }

  addLand(landInfo: RequiredLandInfo): Observable<QuollRes> {
    let url = "http://localhost:3000/api/create_native_title"
    return this.http.post<QuollRes>(url, landInfo, httpOptions);
  }

  editProperty(info: any): any {
    let url = "http://localhost:3000/api/edit_property";

    return new Promise((resolve, reject) => {
      this.http.post<any>(url, info, httpOptions)
      .subscribe(res => {
        if (res.code == 0) {
          resolve({ code: 0 })
        }
        else {
          resolve({ code: -1 })
        }
      })
    })
  }

  editAccount(info: any): any {
    let url = "http://localhost:3000/api/edit_administrator";
    
    return new Promise((resolve, reject) => {
      this.http.post<any>(url, info, httpOptions)
      .subscribe(res => {
        if (res.code == 0) {
          resolve({ code: 0 })
        }
        else {
          resolve({ code: -1 })
        }
      })
    })
  }

  deleteProperty(_id: string): any {
    let url = "http://localhost:3000/api/delete_native_title";

    return new Promise((resolve, reject) => {
      this.http.post<any>(url, { '_id': _id }, httpOptions)
      .subscribe(res => {
        if (res.code == 0) {
          resolve({ code: 0 })
        }
        else {
          resolve({ code: -1, errMsg: res.errMsg })
        }
      })
    })
  }

  deleteAccount(_id: string): any {
    let url = "http://localhost:3000/api/delete_administrator";

    return new Promise((resolve, reject) => {
      this.http.post<any>(url, { '_id': _id }, httpOptions)
      .subscribe(res => {
        if (res.code == 0) {
          resolve({ code: 0 })
        }
        else {
          resolve({ code: -1, errMsg: res.errMsg })
        }
      })
    })
  }

  autocompleteAddress(keyword: string) {

    let url = "http://localhost:3000/api/autocomplete_address"

    return new Promise((resolve, reject) => {
      this.http.post<any>(url, { 'keyword': keyword }, httpOptions)
      .subscribe(res => {
        console.log(res);
        if (res.code == 0) {
          this.addressResults = res.data.predictions
        }
        else {
          this.addressResults = [];
        }

        resolve({ code: 0 })
      })  
    })
  }

  geocoding(address: string): any {
    let url = "http://localhost:3000/api/geocoding"

    return new Promise((resolve, reject) => {
      this.http.post<any>(url, { 'keyword': address }, httpOptions)
      .subscribe(res => {
        if (res.code == 0 && res.data.results.length > 0) {
          resolve({
            code: 0,
            data: res.data.results[0].geometry.viewport
          })
        }
        else {
          resolve({
            code: -1
          })
        }
      })
    })
  }
}
