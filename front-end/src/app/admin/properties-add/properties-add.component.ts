import { Component, OnInit } from '@angular/core';
import {PropertiesService} from '../properties.service'
import { PeriodicElement } from '../periodicElement';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

export interface RequiredLandInfo {
  agreement_type: number,
  plot_id: string,
  address: string,
  owner: string,
  coordinates: any
}
@Component({
  selector: 'app-properties-add',
  templateUrl: './properties-add.component.html',
  styleUrls: ['./properties-add.component.css']
})


export class PropertiesAddComponent implements OnInit {
  propertyFormControl: FormGroup;
  //selectedType: string;
  propertyId: string;
  propertyAddress: string;
  propertyIdOwner: string;
  propertyType: number;
  propertyCoordinates: string
  tokens: string[]
  coor: any
  
  addresskeyword: string
  ifSearching: boolean

  add : PeriodicElement;
  
  addProperty() {
    console.log(this.propertyFormControl.value);

    if (!this.checkCoordinates(this.propertyFormControl.value.propertyCoordinates)) {
      this.openSnackBar('Please input valid coordinates set', 'Try again')
      return;
    }

    this.tokens = (this.propertyFormControl.value.propertyCoordinates).split(";")
    // this.coor = this.convert(this.tokens);
    this.coor = this.tokens;
    console.log(this.coor);
    let land = {
      agreement_type: Number(this.propertyFormControl.value.propertyType),
      plot_id: this.propertyFormControl.value.propertyId,
      address: this.propertyFormControl.value.propertyAddress,
      owner: this.propertyFormControl.value.propertyOwner,
      coordinates: this.coor
    }
    //this.propertyService.addLand(land);
      // 0 as administrator
    console.log(land);
    this.propertyService.addLand(land)
      .subscribe(res => {
        if (res.code == 0) {
          this.openSnackBar('Create successfully!', 'OK')
        }
        else {
          this.openSnackBar('Create failed.', 'OK')
        }
      })
  }

  checkCoordinates(coo: string): boolean {
    let coo1 = coo.trim().split(';') 
    if (coo1.length < 3)  return false;

    for (let i = 0, len = coo1.length; i < len; ++i) {
      let coo2 = coo1[i].trim().split(',');

      if (coo2.length != 2) return false;

      for (let j = 0; j < 2; ++j) {
        // console.log(typeof(Number(coo2[j].trim())))
        if (isNaN(Number(coo2[j].trim()))) {
          return false;
        }
      }
    }

    return true;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  constructor(private propertyService: PropertiesService, 
    public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.propertyFormControl = new FormGroup({
      'propertyId': new FormControl(this.propertyId, Validators.required),
      'propertyAddress': new FormControl(this.propertyAddress, Validators.required),
      'propertyOwner': new FormControl(this.propertyIdOwner, Validators.required),
      'propertyType': new FormControl(this.propertyType, Validators.required),
      'propertyCoordinates': new FormControl(this.propertyCoordinates, Validators.required)
    })

    this.ifSearching = false;
  }
  get property_id() { return this.propertyFormControl.get('propertyId'); }
  get property_address() { return this.propertyFormControl.get('propertyAddress'); }
  get property_owner() { return this.propertyFormControl.get('propertyOwner'); }
  get property_type() { return this.propertyFormControl.get('propertyType'); }
  get property_coordinates() { return this.propertyFormControl.get('propertyCoordinates'); }

  // getPush(add: PeriodicElement): void{
  //   this.propertyService.getPush(add);
  // }

  convert(element: string[]): any{
    var coordinates = []
    for(var i = 0; i < element.length; i++){
      var lst = [];
      var pair = element[i].split(",")
      var longitude = Number(pair[0]);
      var latitude = Number(pair[1]);
      lst.push(longitude);
      lst.push(latitude);
      console.log(lst);
      coordinates.push(lst);
    }
    return coordinates;
  }

  onAddressChange(value: string): void {
    if (value == "") return;

    console.log(value)
    this.ifSearching = true;

    this.propertyService.autocompleteAddress(value)
    .then(res => {
      this.ifSearching = false;
    })
  }

  chooseAddress(address: string) {
    this.propertyAddress = address;
  }

  geocoding() {
    this.propertyService.geocoding(this.propertyAddress)
    .then(res => {
      let coordinatesStr = "";

      console.log(res)
      if (res.code == 0) {
        let coArr = [];
        coArr.push(res.data.northeast.lat + ',' + res.data.northeast.lng)
        coArr.push(res.data.northeast.lat + ',' + res.data.southwest.lng)
        coArr.push(res.data.southwest.lat + ',' + res.data.southwest.lng)
        coArr.push(res.data.southwest.lat + ',' + res.data.northeast.lng)

        coordinatesStr = coArr.join(';')
      }
      else {
        coordinatesStr = '0'
      }

      this.propertyFormControl.patchValue({propertyCoordinates: coordinatesStr})
      // this.propertyFormControl.setValue({'propertyCoordinates': coordinatesStr})
    })
  }
}
