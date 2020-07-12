/// <reference types="@types/googlemaps" />

import { Injectable, ApplicationRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeTitle } from './native-title'
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';

const RootUrl = 'http://localhost:3000/api/'
const API = {
  'RequestNativeTitlesByArea': RootUrl + 'get_native_titles_by_area',
  'RequestNativeTitleByPlotId': RootUrl + 'get_certain_native_title_by_plot_id',

  'AddNativeTitlesAsFavourite': RootUrl + 'favourite_native_titles',
  'RequestFavouriteNativeTitles': RootUrl + 'get_favourite_native_titles_list',
  'DeleteFavouriteNativeTitles': RootUrl + 'unfavourite_native_titles',

  'AddNativeTitlesAsHistory': RootUrl + 'add_history_records',
  'RequestHistoryNativeTitles': RootUrl + 'get_history_records_list',
  'DeleteHistoryNativeTitles': RootUrl + 'delete_history_records',

  'AddNativeTitlesAsOwn': RootUrl + 'add_properties_as_own',
  'RequestOwnNativeTitles': RootUrl + 'get_own_properties_list',
  'DeleteOwnNativeTitles': RootUrl + 'delete_own_properties',

  'SearchByPlotId': RootUrl + 'search_by_plot_id',
  'SearchByAddress': RootUrl + 'search_by_address',

  'SearchByRegion': RootUrl + 'autocomplete_region',
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

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  public currentNativeTitle: NativeTitle
  public ifLikedCurrentNativeTitle: boolean

  public favouriteList: any[]
  public historyList: any[]
  public ownList: any[]

  public searchResults: any[]
  public regionResults: any[]

  public ifSetCurrent: boolean
  public functionIndex: number

  constructor(
    private http: HttpClient,
    private ref: ApplicationRef,
    private userService: UserService ) {

    this.ifSetCurrent = false;
    this.functionIndex = 0;
    this.favouriteList = [];
    this.historyList = [];
    this.ownList = [];
    this.ifLikedCurrentNativeTitle = false;

    this.searchResults = [];
  }

  changeCurrentFunctionIndex(index: number) {
    this.functionIndex = index;
  }

  clearSearchResults(): void {
    this.searchResults = [];
  }
  changeCurrentNativeTitle(info: any) {

    this.ifSetCurrent = true;
    this.changeCurrentFunctionIndex(1);
    this.currentNativeTitle = new NativeTitle(info);

    // check if liked current
    this.ifLikedCurrentNativeTitle = false;
    for (let i = 0, len = this.favouriteList.length; i < len; ++i) {
      if (this.currentNativeTitle.plot_id == this.favouriteList[i].plot_id) {
        this.ifLikedCurrentNativeTitle = true;
        break;
      }
    }
    
    if (this.userService.currentUser) {
      this.addHistoryLocally(info)
      this.addNativeTitlesAsHistory({
        'user_id': this.userService.currentUser._id,
        'plot_id_list': [this.currentNativeTitle.plot_id] 
      }).subscribe(res => {
        if (res.code == 0) {
          console.log('Add to history successfully')
        }
        else {
          console.log('Add to history failed')
        }
      })
    }
    console.log(this.ifLikedCurrentNativeTitle)
    this.ref.tick();
  }
  
  addFavouriteLocally(nativeTitleInfo) {
    let newFavouriteList = this.favouriteList;

    let ifExist = false
    for (let i = 0, len = newFavouriteList.length; i < len; ++i) {
      if (newFavouriteList[i].plot_id == nativeTitleInfo.plot_id) {
        newFavouriteList[i].update_time = Date.now();
        ifExist = true;
        break;
      }
    }

    if (!ifExist) {
      let newNativeTitle = nativeTitleInfo;
      newNativeTitle.update_time = Date.now();
      newFavouriteList.push(newNativeTitle)
    }

    newFavouriteList.sort((a, b) => {
      return b.update_time - a.update_time
    })

    this.favouriteList = newFavouriteList;

    this.ref.tick();
  }

  deleteFavouriteLocally(list) {
    let deleteList = list;
    let afterList = this.favouriteList;

    for (let i = 0, len = deleteList.length; i < len; ++i) {
      for (let j = 0, len2 = afterList.length; j < len2; ++j) {
        if (deleteList[i] == afterList[j].plot_id) {
          afterList.splice(j, 1);
          break;
        }
      }
    }

    this.favouriteList = afterList;
    this.ref.tick();
  }

  deleteHistoryLocally(list) {
    let deleteList = list;
    let afterList = this.historyList;

    for (let i = 0, len = deleteList.length; i < len; ++i) {
      for (let j = 0, len2 = afterList.length; j < len2; ++j) {
        if (deleteList[i] == afterList[j].plot_id) {
          afterList.splice(j, 1);
          break;
        }
      }
    }

    this.historyList = afterList;
    this.ref.tick();
  }

  addHistoryLocally(nativeTitleInfo) {
    let newHistoryList = this.historyList;

    let ifExist = false;

    for (let i = 0, len = newHistoryList.length; i < len; ++i) {
      if (newHistoryList[i].plot_id == nativeTitleInfo.plot_id) {
        newHistoryList[i].update_time = Date.now();
        ifExist = true;
        break;
      }
    }

    if (!ifExist) {
      let newNativeTitle = nativeTitleInfo;
      newNativeTitle.update_time = Date.now();
      newHistoryList.push(newNativeTitle)
    }

    newHistoryList.sort((a, b) => {
      return b.update_time - a.update_time
    })

    this.historyList = newHistoryList;

    this.ref.tick();
  }

  requestNativeTitlesByArea(param: any): any {
    return new Promise((resolve, reject) => {
      this.http.post<QuollResponse>(API.RequestNativeTitlesByArea, {}, httpOptions)
      .subscribe(res => {
        if (res.code == 0) {
          let nativeTitleList = []
          for (let i = 0, len = res.data.length; i < len; ++i) {
            console.log(res.data[i])
            nativeTitleList.push(new NativeTitle(res.data[i]))
          }
          resolve({ code: 0, data: nativeTitleList })
        }
        else {
          resolve({ code: -1, data: res.errMsg })
        }
      })
    }) 
    
  }

  requestNativeTitleByPlotId(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.RequestNativeTitleByPlotId, {
      'plot_id': param.plot_id,
      'user_id': param.user_id ? param.user_id : ''
    }, httpOptions)
  }

  addNativeTitlesAsFavourite(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.AddNativeTitlesAsFavourite, {
      'user_id': param.user_id,
      'plot_id_list': param.plot_id_list
    }, httpOptions)
    .pipe(
      tap(res => {
        if (res.code == 0) {
          this.addFavouriteLocally(this.currentNativeTitle)
          this.ifLikedCurrentNativeTitle = true;
          this.ref.tick();
        }
      })
    )
  }

  requestFavouriteNativeTitles(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.RequestFavouriteNativeTitles, {
      'user_id': param.user_id,
    }, httpOptions)
    .pipe(
      tap((res) => {
        if (res.code == 0) {
          this.favouriteList = res.data
        }
      })
    )
  }

  deleteFavouriteNativeTitles(param: any): Observable<QuollResponse> {
    this.deleteFavouriteLocally(param.plot_id_list);

    console.log(param.plot_id_list)
    return this.http.post<QuollResponse>(API.DeleteFavouriteNativeTitles, {
      'user_id': param.user_id,
      'plot_id_list': param.plot_id_list
    }, httpOptions)
    .pipe(
      tap(res => {
        if (res.code == 0) {
          this.ifLikedCurrentNativeTitle = false;
          this.ref.tick();
        }
      })
    )
  }

  addNativeTitlesAsHistory(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.AddNativeTitlesAsHistory, {
      'user_id': param.user_id,
      'plot_id_list': param.plot_id_list
    }, httpOptions)
  }

  requestHistoryNativeTitles(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.RequestHistoryNativeTitles, {
      'user_id': param.user_id,
    }, httpOptions)
    .pipe(
      tap((res) => {
        if (res.code == 0) {
          this.historyList = res.data;
          this.ref.tick();
        }
      })
    )
  }

  deleteHistoryNativeTitles(param: any): Observable<QuollResponse> {
    this.deleteHistoryLocally(param.plot_id_list)

    return this.http.post<QuollResponse>(API.DeleteHistoryNativeTitles, {
      'user_id': param.user_id,
      'plot_id_list': param.plot_id_list
    }, httpOptions)
  }

  searchByPlotId(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.SearchByPlotId, {
      'plot_id': param.plot_id
    }, httpOptions)
    .pipe(
      tap(res => {
        if (res.code == 0) {
          this.searchResults = res.data;
          this.ref.tick();
        }
      })
    )
  }

  searchByAddress(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.SearchByAddress, {
      'address': param.address
    }, httpOptions)
    .pipe(
      tap(res => {
        if (res.code == 0) {
          this.searchResults = res.data;
          this.ref.tick();
        }
      })
    )
  }

  searchByRegion(keyword: string): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.SearchByRegion, {
      'keyword': keyword
    }, httpOptions)
    .pipe(
      tap(res => {
        if (res.code == 0) {
          this.regionResults = res.data;
          this.ref.tick();
        }
      })
    )
  }

  addNativeTitlesAsOwn(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.AddNativeTitlesAsOwn, {
      'user_id': param.user_id,
      'plot_id_list': param.plot_id_list
    }, httpOptions)
  }

  requestOwnNativeTitles(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.RequestOwnNativeTitles, {
      'user_id': param.user_id,
    }, httpOptions)
    .pipe(
      tap((res) => {
        if (res.code == 0) {
          this.ownList = res.data
        }
      })
    )
  }

  deleteOwnNativeTitles(param: any): Observable<QuollResponse> {
    return this.http.post<QuollResponse>(API.DeleteOwnNativeTitles, {
      'user_id': param.user_id,
      'plot_id_list': param.plot_id_list
    }, httpOptions)
  }
}
