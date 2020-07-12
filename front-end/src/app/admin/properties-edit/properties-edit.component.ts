import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PropertiesService } from '../properties.service'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-properties-edit',
  templateUrl: './properties-edit.component.html',
  styleUrls: ['./properties-edit.component.css']
})
export class PropertiesEditComponent implements OnInit {
  @Input() currentProperty: any
  @Output() deletePropEmit = new EventEmitter<object>()
  @Output() modifiedPropEmit = new EventEmitter<object>()

  constructor(
    private propertiesService: PropertiesService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  modifyProperty(event: any): void {

    console.log(this.currentProperty);

    if (!this.checkCoordinates(this.currentProperty.coordinatesStr)) {
      this.openSnackBar('Please input valid coordinates set', 'Try again');
      return
    }
    
    let modifiedProperty = {
      '_id': this.currentProperty._id,
      'agreement_type': this.currentProperty.agreement_type,
      'plot_id': this.currentProperty.plot_id,
      'address': this.currentProperty.address,
      'owner': this.currentProperty.owner,
      'coordinates': this.currentProperty.coordinatesStr.split(';')
    }
    
    this.propertiesService.editProperty(modifiedProperty)
    .then(res => {
      if (res.code == 0) {
        this.openSnackBar('Modified successfully!', 'OK')

        this.modifiedPropEmit.emit(this.currentProperty)
        
        this.turnOffEditing();
      }
      else {
        this.openSnackBar('Modified failed.', 'OK')
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

  deleteProperty(): void {
    this.propertiesService.deleteProperty(this.currentProperty._id)
    .then(res => {
      if (res.code == 0) {
        this.openSnackBar('Deleted successfully!', 'OK')
        this.deletePropEmit.emit(this.currentProperty)
        this.turnOffEditing();
      }
      else {
        this.openSnackBar('Deleted failed.', 'OK')
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  turnOffEditing() {
    console.log('turn off')
    this.currentProperty = {}
  }
}
