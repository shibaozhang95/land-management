import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Property } from '../property'
import { SideBarUserComponent } from '../side-bar-user/side-bar-user.component'
import { SideBarFunctionComponent } from '../side-bar-function/side-bar-function.component'
import { UserService } from '../user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  @Output() toggleSideBar = new EventEmitter<object>()
  @Input() currentProperty: Property

  public state: string
  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
    this.state = 'inactive'
  }

  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';

    this.toggleSideBar.emit({
      state: this.state
    })

  }

  turnOn() {
    this.state = 'active'

    this.toggleSideBar.emit({
      state: this.state
    })
  }

  turnOff() {
    this.state = 'inactive'
    
    
    this.toggleSideBar.emit({
      state: this.state
    })
  }

}
