/// <reference types="@types/googlemaps" />

import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { PropertyService } from '../property.service'
import { Property } from '../property'
import { MatSnackBar } from '@angular/material';


const mapProp = {
  center: new google.maps.LatLng(-37.80511957327668, 144.9534082391806),
  zoom: 14,
  maxZoom: 18,
  minZoom: 5,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  clickableIcons: false
}

const ColourFor1 = '#6200EE'
const StrokeColour1 = '#6200EE'
const ColourFor2 = '#03DAC6'
const StrokeColour2 = '#03DAC6'
const ColourFor3 = '#C51162'
const StrokeColour3 = '#C51162'

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  @Output() showDetail = new EventEmitter<object>()

  public map: google.maps.Map;
  // public map: google.maps.Map
  public bermudaTriangle: google.maps.Polygon;
  public marker: google.maps.Marker;
  properties: Property[]

 
  constructor(
    private propertyService: PropertyService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp)

    this.map.addListener('click', this._mapClick)
    this.map.addListener('zoom_changed', this._mapZoomChanged)
    this.map.addListener('drag', this._mapDrag)

    // this.createLayerData();
    this.createNativeTitleLayerData();
  }

  private createNativeTitleLayerData(): void {
    this.propertyService.requestNativeTitlesByArea({})
    .then(res => {
      console.log(res)
      if (res.code == 0) {
        for (let i = 0, len = res.data.length; i < len; ++i) {
          // console.log(res.data[i])
          this.map.data.add({
            properties: {
              ifClick: false,
              property: res.data[i]
            },
            geometry: new google.maps.Data.Polygon([res.data[i].geometry])
          })
        }
      }
      else {
        this.openSnackBar('Something wrong when request data', 'Try agian later')
      }

      this.map.data.setStyle((feature) => {
        // console.log(feature)
        // let color = 'rgb(233, 21, 21)';
        // if (feature.getProperty('ifClick')) {
        //   color = 'red'
        // }
        // return ({
        //   fillColor: color
        // })
        return this.workForLegend(feature)
      })
      this.map.data.addListener('click', this._layerClick);
      this.map.data.addListener('mouseover', this._layerMouseover);
      this.map.data.addListener('mouseout', this._layerMouseout);
    })

  }

  workForLegend(feature) {
    let fillColour = '';
    let strokeColour = ''

    let agreementType = parseInt(feature.getProperty('property').agreement_type)

    if (agreementType == 1) {
      fillColour = ColourFor1;
      strokeColour = StrokeColour1;
    }
    else if (agreementType == 2) {
      fillColour = ColourFor2;
      strokeColour = StrokeColour2;
    }
    else if (agreementType == 3) {
      fillColour = ColourFor3
      strokeColour = StrokeColour3;
    }
    else {
      fillColour = 'grey';
      strokeColour = 'grey';
    }
    
    return ({
      'fillColor': fillColour,
      // 'strokeColor': strokeColour,
      'strokeWeight': 1
    })
  }

  public moveToNativeTitle(map, marker, coordinates: number[][]): void {
    let centerPosition = getCentroid(coordinates)

    // set marker
    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(centerPosition[0], centerPosition[1]),
      map: this.map
    })
    this.marker.setMap(this.map)

    // move to central
    this.map.panTo({lat: centerPosition[0], lng: centerPosition[1]})

    // zoom in/out
    this.map.setZoom(16)
  }

  public moveToRegion(coordinates: any) {
    this.map.panTo({lat: coordinates.lat, lng: coordinates.lng})
    this.map.setZoom(14);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  private _mapClick = ((event) => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();

    console.log(lat, lng)
  })

  private _mapZoomChanged = (() => {
    let zoom = this.map.getZoom();
    console.log(zoom)
    
    if (zoom > 14 || zoom == 14) {
      // this.map.data.setStyle({
      //   fillColor: 'blue'
      // })
      this.map.data.setStyle((feature) => {
        return this.workForLegend(feature)
      })
      if (this.marker) this.marker.setMap(this.map)
    }
    else {
      this.map.data.setStyle({
        visible: false
      })
      if (this.marker) this.marker.setMap(null)
    }
    
  })

  private _mapDrag = (() => {
    
  })

  private _layerClick = ((event) => {
    // Show the marker
    if (this.marker) this.marker.setMap(null);

    let position = getCentroid(event.feature.getProperty('property').coordinates)
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(position[0], position[1]),
      map: this.map
    })
    this.marker.setMap(this.map)

    this.showDetail.emit({
      property: event.feature.getProperty('property')
    })
  })

  private _layerMouseover = ((event) => {
    this.map.data.revertStyle();
    this.map.data.overrideStyle(event.feature, {fillColor: 'red'});
  })

  private _layerMouseout = ((event) => {
    this.map.data.revertStyle();
    // this.marker.setMap(null)
  })
}

var getCentroid = function (coord) 
{
  let newCoo = [];
  for (let i = 0, len = coord.length; i < len; ++i) {
    newCoo.push(coord[i].split(','))
  }
	var center = newCoo.reduce(function (x,y) {
		return [x[0] + y[0]/newCoo.length, x[1] + y[1]/newCoo.length] 
	}, [0,0])
	return center;
}

