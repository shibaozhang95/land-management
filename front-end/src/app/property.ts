/// <reference types="@types/googlemaps" />

export class Property {
  id: string
  address: string
  owner: string 
  type: string 
  termLimitation: number
  coodinates: number[][]

  features: any
  geometry: google.maps.LatLng[]

  constructor(property: any) {
    this.id = property.id;
    this.address = property.address;
    this.owner = property.owner;
    this.type = property.type;
    this.termLimitation = property.termLimitation;
    this.coodinates = property.coodinates;

    this.features = {
      id: property.id,
      address: property.address,
      owner: property.owner,
      type: property.type,
      termLimitation: property.termLimitation,
      coodinates: property.coodinates
    }

    this.geometry = [];
    for (let i = 0, len = property.coodinates.length; i < len; ++i) {
      this.geometry.push(new google.maps.LatLng(property.coodinates[i][0], property.coodinates[i][1]))
    }
  }
}