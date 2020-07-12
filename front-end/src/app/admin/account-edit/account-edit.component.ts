import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { PropertiesService } from '../properties.service'
// import { PropertyService } from 'src/app/property.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  @Input() currentUser: any
  @Output() deleteUserEmit = new EventEmitter<object>()
  @Output() modifiedUserEmit = new EventEmitter<object>()

  password: string
  confirmedPassword: string

  constructor(public snackBar: MatSnackBar,
    public properiesService: PropertiesService) { }

  ngOnInit() {
  }

  changePassword() {
    if (!this.password) {
      this.openSnackBar('Please input password!', '')
      return ;
    }
    if (this.password != this.confirmedPassword) {
      this.openSnackBar('Please enter the same password!', '')
      return ;
    }

    this.properiesService.editAccount({
      '_id': this.currentUser._id,
      'password': this.password
    })
    .then(res => {
      if (res.code == 0) {
        this.openSnackBar('Update password successfully!', 'OK');
        this.modifiedUserEmit.emit({})
      }
      else {
        this.openSnackBar('Updating password failed!', 'Try again later');
      }
    })
  }

  deleteAccount() {
    this.properiesService.deleteAccount(this.currentUser._id)
    .then(res => {
      if (res.code == 0) {
        this.openSnackBar('Delete account successfully!', 'OK');
        this.deleteUserEmit.emit({'_id': this.currentUser._id});
      }
      else {
        this.openSnackBar('Deleting password failed!', 'Try again later');
      }
    })
  }

  turnOffEditing() {
    this.currentUser = {};
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
