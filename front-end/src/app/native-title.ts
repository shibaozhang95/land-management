/// <reference types="@types/googlemaps" />

export class NativeTitle {
  _id: string
  plot_id: string
  address: string
  owner: string
  agreement_type: string
  coordinates: number[][]

  features: any 
  geometry: google.maps.LatLng[]

  constructor(nativeTitleInfo: any) {
    this._id = nativeTitleInfo._id;
    this.plot_id = nativeTitleInfo.plot_id
    this.address = nativeTitleInfo.address
    this.owner = nativeTitleInfo.owner
    this.agreement_type = nativeTitleInfo.agreement_type
    this.coordinates = nativeTitleInfo.coordinates

    this.features = {
      _id: nativeTitleInfo._id,
      plot_id: nativeTitleInfo.plot_id,
      address: nativeTitleInfo.address,
      owner: nativeTitleInfo.owner,
      agreement_type: nativeTitleInfo.agreement_type,
      coordinates: nativeTitleInfo.coordinates,
    }

    this.geometry = [];
    console.log(nativeTitleInfo.coordinates)
    for (let i = 0, len = nativeTitleInfo.coordinates.length; i < len; ++i) {
      let lat = nativeTitleInfo.coordinates[i].split(',')[0]
      let lng = nativeTitleInfo.coordinates[i].split(',')[1]
      this.geometry.push(new google.maps.LatLng(lat, lng))
    }
  }
}