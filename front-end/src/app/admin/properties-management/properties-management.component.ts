import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { PropertiesService } from '../properties.service'

export interface LandInfo {
  _id: string,
  agreement_type: number,
  plot_id: string,
  address: string,
  owner: string,
  coordinates: any
}

@Component({
  selector: 'app-properties-management',
  templateUrl: './properties-management.component.html',
  styleUrls: ['./properties-management.component.css']
})
export class PropertiesManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumnsProperty: string[] = ['id', 'address', 'type', 'edit'];
  propertyList: LandInfo[];
  datasourceProperty: MatTableDataSource<LandInfo>;

  currentProperty: any

  constructor(private database: PropertiesService) { }

  ngOnInit() {
    this.getLandList();
    this.currentProperty = {};
  }

  getLandList(): void {
    this.database.getLandList()
      .subscribe(res => {
        if (res.code == 0) {
          this.propertyList = res.data;
          this.datasourceProperty = new MatTableDataSource<LandInfo>(this.propertyList);
          this.datasourceProperty.paginator = this.paginator;
        }
      })
  }

  editProperty(ele: any): void {
    // console.log(ele);
    let property = {
      '_id': ele._id,
      'agreement_type': ele.agreement_type,
      'coordinates': ele.coordinates,
      'coordinatesStr': ele.coordinates.join(';'),
      'owner': ele.owner,
      'plot_id': ele.plot_id,
      'address': ele.address
    };
    // property.coordinatesStr = property.coordinates.join(';')
    this.currentProperty = property;
    console.log(this.currentProperty)
  }

  // deleteProperty()
  deleteProperty(event) {
    console.log('DELETE')

    let index = -1;
    for (let i = 0, len = this.propertyList.length; i < len; ++i) {
      if (this.propertyList[i]._id == event._id) {
        index = i;
        break;
      }
    }

    if (index != -1) this.propertyList.splice(index, 1)

    this.datasourceProperty = new MatTableDataSource<LandInfo>(this.propertyList);
    this.datasourceProperty.paginator = this.paginator;
  }

  modifiedProperty(event) {
    console.log('MODIFIED')
    
    for (let i = 0, len = this.propertyList.length; i < len; ++i) {
      if (this.propertyList[i]._id == event._id) {
        this.propertyList[i] = event;
        break;
      }
    }

    this.datasourceProperty = new MatTableDataSource<LandInfo>(this.propertyList);
    this.datasourceProperty.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.datasourceProperty.filter = filterValue.trim().toLowerCase();
  }
}
