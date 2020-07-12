import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DefaultRouteReuseStrategy } from '@angular/router/src/route_reuse_strategy';
import { AccountService } from '../account.service';

export interface Admin {
  _id: string,
  username: string,
  password: string,
  user_type: number
}


@Component({
  selector: 'app-accounts-management',
  templateUrl: './accounts-management.component.html',
  styleUrls: ['./accounts-management.component.css']
})
export class AccountsManagementComponent implements OnInit {
  displayedColumnsAdmin: string[] = ['username', 'user_type', 'edit'];
  adminList: Admin[];
  datasourceAdmin: MatTableDataSource<Admin>;

  currentUser: any

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private ref: ChangeDetectorRef, 
    private database: AccountService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAdminsList();
    
  }

  deleteAdmin(id: string, index: number) {
    this.database.deleteAdmin(id)
      .subscribe(res => {
        if (res.code == 0) {
          this.adminList.splice(index, 1);
          
          this.datasourceAdmin = new MatTableDataSource<Admin>(this.adminList)
          this.datasourceAdmin.paginator = this.paginator;

          this.openSnackBar('Delete successfully', 'I know');
        }
        else {
          this.openSnackBar('Delete failed', 'Ok');
        }
      })
  }

  getAdminsList(): void {
    this.database.getAdminsList()
      .subscribe(res => {
        if (res.code == 0) {
          this.adminList = res.data;
          this.datasourceAdmin = new MatTableDataSource<Admin>(this.adminList);
          this.datasourceAdmin.paginator = this.paginator;

          console.log(this.adminList)
        }
      })
  }

  editAdmin(el: any): any {
    this.currentUser = el;
    console.log(this.currentUser)
  }

  deleteUser(opUser: any): any {
    console.log('Delete User')
    console.log(opUser)

    let delete_id = opUser._id
    let index = -1;

    for (let i = 0, len = this.adminList.length; i < len; ++i) {
      if (delete_id == this.adminList[i]._id) {
        index = i;
        break;
      }
    }

    this.adminList.splice(index, 1);
    this.datasourceAdmin = new MatTableDataSource<Admin>(this.adminList);
    this.datasourceAdmin.paginator = this.paginator;

    // turn off the editing window
    this.currentUser = {}
  }

  modifiedUser(opUser: any): any {
    console.log('Modified user')
    console.log(opUser)

    // turn off the editing window
    this.currentUser = {}
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
