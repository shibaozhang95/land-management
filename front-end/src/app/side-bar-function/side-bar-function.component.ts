import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PropertyService } from '../property.service'
import { UserService } from '../user.service'
import { MatSnackBar } from '@angular/material';
import { AppComponent } from '../app.component';
import { MainComponent } from '../main/main.component';

import * as jspdf from 'jspdf'

@Component({
  selector: 'app-side-bar-function',
  templateUrl: './side-bar-function.component.html',
  styleUrls: ['./side-bar-function.component.css']
})
export class SideBarFunctionComponent implements OnInit {
  // favouriteList: []
  // historyList: []
  ifInProgress: boolean

  agreementType = ['Areas where native title does not exist', 'Areas to which sections 47A and 48A NTA apply', 'Areas the subject of non-exclusive native title']
  constructor(
    public propertyService: PropertyService,
    public userService: UserService,
    public snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private appComponent: AppComponent,
    private mainComponent: MainComponent
    // public myMap: MapsComponent
    ) {  }

  ngOnInit() {
    this.ifInProgress = false;

    if (this.userService.currentUser) {
      setTimeout(() => {
        this.requestFavourite();
        this.requestHistory();
      }, 1000)
    }
  }

  switchFunctionTab(event) {
    this.propertyService.changeCurrentFunctionIndex(event.index)
  }

  requestFavourite() {
    this.propertyService.requestFavouriteNativeTitles({
      'user_id': this.userService.currentUser._id
    }).subscribe(res => {
      if (res.code == 0) {
        // this.favouriteList = res.data
        // console.log(this.favouriteList);
      }
      else {
        this.snackBar.open('Something goes wrong when request favourite list', '', {
          duration: 2000,
        });
      }
      this.ref.detectChanges()
    })
  }

  requestHistory() {
    this.propertyService.requestHistoryNativeTitles({
      'user_id': this.userService.currentUser._id
    }).subscribe(res => {
      if (res.code == 0) {
        // this.historyList = res.data
        // console.log(this.historyList)
      }
      else {
        this.snackBar.open('Something goes wrong when request history list', '', {
          duration: 2000,
        });
      }
      this.ref.detectChanges()
    })
  }

  likeCurrent() {
    if (this.userService.currentUser) {
      this.addToFavourite([this.propertyService.currentNativeTitle.plot_id]);
    }
    else {
      this.snackBar.open('Please login first!', '', {
        duration: 2000,
      });
    }
  }
  unlikeCurrent() {
    if (this.userService.currentUser) {
      this.deleteFromFavourite([this.propertyService.currentNativeTitle.plot_id]);
    }
    else {
      this.snackBar.open('Please login first!', '', {
        duration: 2000,
      });
    }
  }

  addToFavourite(plot_id_list) {
    this.ifInProgress = true;
    this.ref.detectChanges()

    this.propertyService.addNativeTitlesAsFavourite({
      'user_id': this.userService.currentUser._id,
      'plot_id_list': plot_id_list
    }).subscribe(res => {
      if (res.code == 0) {
        this.appComponent.openSnackBar('Add to favourite successfully', 'OK')
      }
      else {
        this.appComponent.openSnackBar('Something goes wrong when request favourite', '')
      }

      this.ifInProgress = false;
      this.ref.detectChanges()
      
    })
  }

  deleteFromFavourite(plot_id_list) {
    this.ifInProgress = true;
    this.ref.detectChanges()

    this.propertyService.deleteFavouriteNativeTitles({
      'user_id': this.userService.currentUser._id,
      'plot_id_list': plot_id_list
    }).subscribe(res => {
      if (res.code == 0) {
        this.snackBar.open('Delete from favourite successfully', 'OK', {
          duration: 2000,
        });
      }
      else {
        this.snackBar.open('Something goes wrong when request favourite', '', {
          duration: 2000,
        });
      }
      this.ifInProgress = false;
      this.ref.detectChanges()
    })
  }

  goToNativeTitle(info: any): void {
    // change information
    this.propertyService.changeCurrentNativeTitle(info)

    // change map location
    // console.log(this.myMap)
    // this.myMap.moveToNativeTitle(this.myMap.map, this.myMap.marker, info.coordinates);
    this.mainComponent.moveToNativeTitle(info.coordinates)
  }

  clearAllFavourite(): void {
    let list = this.propertyService.favouriteList;
    console.log(typeof(list))
    let plotIdList = []
    for (let i = 0, len = list.length; i < len; ++i) {
      plotIdList.push(list[i].plot_id)
    }

    this.deleteFavourites(plotIdList);
  }

  deleteOneFavourite(event, plot_id: string): void {
    event.stopPropagation();

    let plot_id_list = []
    plot_id_list.push(plot_id);

    this.deleteFavourites(plot_id_list)
  }

  deleteFavourites(plot_id_list: string[]): void {
    
    console.log(plot_id_list)
 
    this.propertyService.deleteFavouriteNativeTitles({
      'user_id': this.userService.currentUser._id,
      'plot_id_list': plot_id_list
    }).subscribe(res => {
      if (res.code == 0) {
        console.log('Delete from favourite successfully')
      }
      else {
        console.log('Delete from favourite failed')
      }
    })
  }

  clearAllHistory(): void {
    let list = this.propertyService.historyList;

    let plotIdList = []
    for (let i = 0, len = list.length; i < len; ++i) {
      plotIdList.push(list[i].plot_id)
    }

    this.deleteHistories(plotIdList);
  }

  deleteOneHistory(event, plot_id: string): void {
    event.stopPropagation();

    let plot_id_list = []
    plot_id_list.push(plot_id);

    this.deleteHistories(plot_id_list);
  }

  deleteHistories(plot_id_list: string[]): void {
    this.propertyService.deleteHistoryNativeTitles({
      'user_id': this.userService.currentUser._id,
      'plot_id_list': plot_id_list
    }).subscribe(res => {
      if (res.code == 0) {
        console.log('Delete from history successfully')
      }
      else {
        console.log('Delete from history failed')
      }
    })
  }

  printToPDF() {
    this.getDataUri(imgUrl => {
      console.log(imgUrl);

      var doc = new jspdf();

      doc.setFontSize(12);

      doc.setFont("courier");
      doc.setFontType("bold");
      doc.text(15, 15, 'Plot Id:')
      doc.text(15, 30, 'Address:')
      doc.text(15, 45, 'Owner/Group:')
      doc.text(15, 60, 'Agreement type:')

      doc.setFontType("normal");
      doc.text(55, 15, this.propertyService.currentNativeTitle.plot_id)
      doc.text(55, 30, this.propertyService.currentNativeTitle.address)
      doc.text(55, 45, this.propertyService.currentNativeTitle.owner ? this.propertyService.currentNativeTitle.owner : 'N/A')
      doc.text(55, 60, this.agreementType[parseInt(this.propertyService.currentNativeTitle.agreement_type) - 1])
      
      doc.addImage(imgUrl, 'JPEG', 15, 75, 180, 90);
      doc.save('property.pdf')
    })

  }

  getDataUri(cb) {
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');
    img.src = this.createUri();
    img.onload = function() {
      var canvas = document.createElement('canvas');

      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/jpeg");

      // canvas.toDataURL

      // console.log(dataURL);
      // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      cb(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""))
    }
  }

  createUri() {
    let coordinates = this.propertyService.currentNativeTitle.coordinates;

    let root = 'http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls'

    root = root + '&zoom=15';
    root = root + '&scale=2';
    root = root + '&size=800x400';
    
    // set marker
    let centroId = getCentroid(coordinates);
    root = root + '&markers=label|' + centroId[0] + ',' + centroId[1];

    root = root + '&center=' + centroId.join(',')
    // set path
    let pathStr = coordinates.join('|');
    // pathStr = pathStr + '|' + coordinates[coordinates.length - 1]

    console.log(pathStr);
    root = root + '&path=color:0x00000000|weight:5|fillcolor:0x6200EE80|' + pathStr

    // console.log(root);
    return root;
  }

  getBase64Image(img) {
    var canvas = document.createElement('canvas');

    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/jpeg");

    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL
  }
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