/// <reference types="@types/googlemaps" />

import { Component, OnInit, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';
import { PropertyService } from '../property.service';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Output() showDetail = new EventEmitter<object>()

  filteredOptions: string[]
  searchWay: string
  keyword: string
  ifSearching: boolean

  constructor(
    private ref: ChangeDetectorRef,
    public propertyService: PropertyService,
    private mainComponent: MainComponent
  ) { }

  ngOnInit() {
    this.ifSearching = false;
    this.keyword = "";
    this.filteredOptions = ['a', 'b', 'c']
  }

  changeSearchWay(value: string): void {
    console.log(value);
    this.keyword = "";
    this.propertyService.clearSearchResults();
    this.ref.detectChanges();
  }

  onSearchChange(value: string): void {
    if (value == "") return;

    // clear search results
    this.propertyService.searchResults = [];
    this.propertyService.regionResults = [];
    this.ifSearching = true;
    this.ref.detectChanges();

    if (this.searchWay == 'plot_id') {
      this.propertyService.searchByPlotId({
        'plot_id': value
      }).subscribe(res => {
        this.ifSearching = false;
        console.log(res);
        this.ref.detectChanges();
      })
    }
    else if (this.searchWay == 'address') {
      this.propertyService.searchByAddress({
        'address': value
      }).subscribe(res => {
        this.ifSearching = false;
        this.ref.detectChanges();
      })
    }
    else if (this.searchWay == 'region') {
      this.propertyService.searchByRegion(value)
      .subscribe(res => {
        this.ifSearching = false;
        console.log(res);
        this.ref.detectChanges();
      })
    } 
  }

  goToNativeTitle(info: any): void {
    // console.log(info)

    // this.propertyService.changeCurrentNativeTitle(info)
    this.showDetail.emit({
      property: info
    })

    this.mainComponent.moveToNativeTitle(info.coordinates)
  }

  goToRegion(region: any): void {
    console.log(region)

    // this.mapsComponent.moveToRegion(region.geometry)
    this.mainComponent.moveToRegion(region.geometry)
  }
}
