import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {
  
 
  constructor(private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) {
  }


  ngOnInit() {
    setTimeout(() => {
      if (this.userService.currentUser && this.userService.currentUser.user_type == 0) {

      }
      else if (this.userService.currentUser && this.userService.currentUser.user_type != 0) {
        this.router.navigate(['/main'], { relativeTo: this.route })
      }
      else {
        this.router.navigate(['/login'], { relativeTo: this.route })
      }
    }, 1000)
  }

}
