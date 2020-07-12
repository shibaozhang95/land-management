import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { Location } from '@angular/common';

@Component({
  selector: 'app-side-bar-user',
  templateUrl: './side-bar-user.component.html',
  styleUrls: ['./side-bar-user.component.css']
})
export class SideBarUserComponent implements OnInit {

  constructor(
    public userService: UserService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  logOut(): void {
    this.userService.logOut()
    .then(res => {
      window.location.reload();
    })
  }
}
